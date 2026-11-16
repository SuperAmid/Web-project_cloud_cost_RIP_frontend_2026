import { FC, useEffect, useRef, useState } from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { RouterVideo } from "../components/RouterVideo";
import { formatBandwidth, formatCost } from "../modules/format";
import { ROUTES } from "../Routes";
import { useAppDispatch, useAppSelector, useIsAuth } from "../store";
import { fetchFeed, toggleLike } from "../store/feedSlice";

// Лента: одна карточка на весь экран — видео, поверх него слева название и
// описание, справа два поля по теме, лайки и кнопка «Следующий».
// /provider_routers/feed — первая карточка, /provider_routers/feed/:id — карточка по id.
export const FeedPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuth = useIsAuth();
  const { item, loading, notFound, error } = useAppSelector((state) => state.feed);
  const [expanded, setExpanded] = useState(false); // «Ещё» / «Скрыть» у описания
  // Что уже загружено: «id|вошёл ли пользователь». После «Следующий» карточка уже
  // в store, и повторный запрос при смене адреса не нужен.
  const loadedKey = useRef("");

  // Загружаем карточку при открытии страницы, при смене id в адресе
  // и после входа/выхода (от токена зависит is_liked)
  useEffect(() => {
    setExpanded(false);
    const key = `${id ?? ""}|${isAuth}`;
    if (loadedKey.current === key) return;
    loadedKey.current = key;
    dispatch(fetchFeed({ id: id ? Number(id) : undefined }));
  }, [dispatch, id, isAuth]);

  // «Следующий» — GET /feed?id=…&next=true, затем переход на адрес новой карточки
  const handleNext = async () => {
    if (!item) return;
    const result = await dispatch(fetchFeed({ id: item.id, next: true }));
    if (fetchFeed.fulfilled.match(result) && result.payload.item) {
      loadedKey.current = `${result.payload.item.id}|${isAuth}`;
      navigate(`${ROUTES.FEED}/${result.payload.item.id}`);
    }
  };

  // Лайк доступен только создателю (после входа)
  const handleLike = () => {
    if (!item || !isAuth) return;
    dispatch(toggleLike({ id: item.id, like: item.is_liked === 0 }));
  };

  if (loading && !item) {
    return (
      <div className="page-loader">
        <Spinner animation="border" />
      </div>
    );
  }

  if (notFound || !item) {
    return (
      <div className="page-message">
        <h1>Маршрутизатор не найден</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        <Button className="action-button" onClick={() => navigate(ROUTES.FEED)}>
          К началу ленты
        </Button>
      </div>
    );
  }

  return (
    <section className="feed-card">
      <RouterVideo className="provider_router_video" src={item.video_url} poster={item.image_url} />
      <div className="feed-shade" />

      <div className="feed-content">
        <div className="feed-text">
          <p className="eyebrow">Маршрутизатор · #{item.id}</p>
          <h1>{item.name}</h1>
          <p className={expanded ? "full-description" : "short-description"}>{item.description}</p>
          <Button variant="link" className="more-button" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Скрыть" : "Ещё"}
          </Button>
          {error && <p className="feed-error">{error}</p>}
        </div>

        <aside className="feed-side" aria-label="Параметры маршрутизатора">
          <div className="metric">
            <span>Пропускная способность</span>
            <strong>{formatBandwidth(item.bandwidth_mbps)}</strong>
          </div>
          <div className="metric">
            <span>Стоимость</span>
            <strong>{formatCost(item.cost_rub)}</strong>
          </div>
          {isAuth ? (
            <button
              type="button"
              className={`like-icon like-button${item.is_liked ? " liked" : ""}`}
              aria-label={item.is_liked ? "Убрать лайк" : "Поставить лайк"}
              onClick={handleLike}
            >
              ♥<b>{item.likes_count}</b>
            </button>
          ) : (
            <span className="like-icon" aria-label="Лайки">
              ♥<b>{item.likes_count}</b>
            </span>
          )}
          <Button className="next-icon" aria-label="Следующий маршрутизатор" onClick={handleNext}>
            →
          </Button>
        </aside>
      </div>
    </section>
  );
};
