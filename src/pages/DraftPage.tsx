import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { RouterImage } from "../components/RouterImage";
import { ROUTES } from "../Routes";
import { useAppDispatch, useAppSelector, useIsAuth } from "../store";
import { createDraft, fetchDraft, publishDraft } from "../store/draftSlice";
import { deleteProviderRouter } from "../store/providerRoutersSlice";

// Превью выбранного файла: адрес blob: живёт, пока файл выбран
const useFilePreview = (file: File | null) => {
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (!file) {
      setUrl("");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  return url;
};

// Добавление маршрутизатора (только для создателя) в два шага:
// 1) черновик — название, изображение и видео (POST multipart/form-data);
// 2) публикация — описание, пропускная способность и стоимость (PUT /publish).
export const DraftPage: FC = () => {
  const isAuth = useIsAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { draft, loading, saving, error } = useAppSelector((state) => state.draft);

  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [bandwidth, setBandwidth] = useState("");
  const [cost, setCost] = useState("");

  const imagePreview = useFilePreview(image);
  const videoPreview = useFilePreview(video);

  useEffect(() => {
    if (isAuth) dispatch(fetchDraft());
  }, [dispatch, isAuth]);

  // Поля публикации заполняем из черновика, если он уже был
  useEffect(() => {
    if (draft) {
      setDescription(draft.description);
      setBandwidth(draft.bandwidth_mbps ? String(draft.bandwidth_mbps) : "");
      setCost(draft.cost_rub ? String(draft.cost_rub) : "");
    }
  }, [draft]);

  if (!isAuth) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const pickFile =
    (setter: (file: File | null) => void) => (event: ChangeEvent<HTMLInputElement>) =>
      setter(event.target.files?.[0] ?? null);

  const handleCreate = (event: FormEvent) => {
    event.preventDefault();
    if (!image || !video) return;
    dispatch(createDraft({ name, image, video }));
  };

  const handlePublish = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft) return;
    const result = await dispatch(
      publishDraft({
        id: draft.id,
        description,
        bandwidth_mbps: Number(bandwidth),
        cost_rub: Number(cost),
      }),
    );
    if (publishDraft.fulfilled.match(result)) {
      setName("");
      setImage(null);
      setVideo(null);
      navigate(`${ROUTES.FEED}/${result.payload.id}`);
    }
  };

  const handleDeleteDraft = async () => {
    if (!draft) return;
    await dispatch(deleteProviderRouter(draft.id));
    dispatch(fetchDraft());
  };

  return (
    <div className="page-grid-content">
      <header className="page-header">
        <p className="eyebrow">Сеть провайдера · ЛР6</p>
        <h1>Добавление</h1>
        <p>{draft ? "Шаг 2 из 2: заполните поля и опубликуйте." : "Шаг 1 из 2: название, изображение и видео."}</p>
      </header>

      {loading ? (
        <div className="page-loader">
          <Spinner animation="border" />
        </div>
      ) : draft ? (
        <Form className="form-card" onSubmit={handlePublish}>
          <div className="draft-media">
            <RouterImage className="draft-image" src={draft.image_url} alt={draft.name} />
            <video className="draft-video" src={draft.video_url} muted loop autoPlay playsInline />
          </div>
          <p className="draft-name">
            Черновик #{draft.id}: <b>{draft.name}</b>
          </p>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Описание</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              maxLength={500}
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="bandwidth">
            <Form.Label>Пропускная способность, Мбит/с</Form.Label>
            <Form.Control
              type="number"
              min={1}
              required
              value={bandwidth}
              onChange={(event) => setBandwidth(event.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="cost">
            <Form.Label>Стоимость, ₽</Form.Label>
            <Form.Control
              type="number"
              min={1}
              required
              value={cost}
              onChange={(event) => setCost(event.target.value)}
            />
          </Form.Group>
          {error && <Alert variant="danger">{error}</Alert>}
          <Button className="action-button" type="submit" disabled={saving}>
            {saving ? "Публикация…" : "Опубликовать"}
          </Button>
          <Button variant="link" className="danger-link" onClick={handleDeleteDraft} disabled={saving}>
            Удалить черновик
          </Button>
        </Form>
      ) : (
        <Form className="form-card" onSubmit={handleCreate}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Название</Form.Label>
            <Form.Control
              required
              maxLength={120}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Изображение (jpg, png, webp, svg до 10 МБ)</Form.Label>
            <Form.Control
              type="file"
              required
              accept=".jpg,.jpeg,.png,.webp,.svg"
              onChange={pickFile(setImage)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="video">
            <Form.Label>Видео (mp4, webm, mov до 50 МБ)</Form.Label>
            <Form.Control
              type="file"
              required
              accept=".mp4,.webm,.mov"
              onChange={pickFile(setVideo)}
            />
          </Form.Group>
          <div className="draft-media">
            <RouterImage className="draft-image" src={imagePreview} alt="Выбранное изображение" />
            {videoPreview ? (
              <video className="draft-video" src={videoPreview} muted loop autoPlay playsInline />
            ) : (
              <div className="draft-video draft-placeholder">Видео не выбрано</div>
            )}
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Button className="action-button" type="submit" disabled={saving}>
            {saving ? "Загрузка…" : "Далее"}
          </Button>
        </Form>
      )}
    </div>
  );
};
