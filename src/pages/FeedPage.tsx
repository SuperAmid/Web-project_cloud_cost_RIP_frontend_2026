import { FC, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { RouterVideo } from "../components/RouterVideo";
import { formatBandwidth, formatCost } from "../modules/format";
import { getProviderRouterFeed } from "../modules/providerRoutersApi";
import { ProviderRouter } from "../modules/types";
import { ROUTES } from "../Routes";

// Лента: одна карточка на весь экран — видео, поверх него слева название и
// описание, справа два поля по теме, лайки и кнопка «Следующий».
// /provider_routers/feed — первая карточка, /provider_routers/feed/:id — карточка по id.
export const FeedPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [router, setRouter] = useState<ProviderRouter>();
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false); // «Ещё» / «Скрыть» у описания

  // Загружаем карточку при открытии страницы и при каждой смене id в адресе
  useEffect(() => {
    let active = true; // ответ для старого id после перехода не применяем
    setLoading(true);
    setExpanded(false);
    getProviderRouterFeed(id ? Number(id) : undefined).then((item) => {
      if (active) {
        setRouter(item);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [id]);

  // «Следующий» — как GET /feed?id=…&next=true: берём карточку после текущей
  const handleNext = () => {
    if (!router) return;
    getProviderRouterFeed(router.id, true).then((item) => {
      if (item) navigate(`${ROUTES.FEED}/${item.id}`);
    });
  };

  if (loading) {
    return (
      <div className="page-loader">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!router) {
    return (
      <div className="page-message">
        <h1>Маршрутизатор не найден</h1>
        <Button className="action-button" onClick={() => navigate(ROUTES.FEED)}>
          К началу ленты
        </Button>
      </div>
    );
  }

  return (
    <section className="feed-card">
      <RouterVideo
        className="provider_router_video"
        src={router.video_url}
        poster={router.image_url}
      />
      <div className="feed-shade" />

      <div className="feed-content">
        <div className="feed-text">
          <p className="eyebrow">Маршрутизатор · #{router.id}</p>
          <h1>{router.name}</h1>
          <p className={expanded ? "full-description" : "short-description"}>
            {router.description}
          </p>
          <Button
            variant="link"
            className="more-button"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Скрыть" : "Ещё"}
          </Button>
        </div>

        <aside className="feed-side" aria-label="Параметры маршрутизатора">
          <div className="metric">
            <span>Пропускная способность</span>
            <strong>{formatBandwidth(router.bandwidth_mbps)}</strong>
          </div>
          <div className="metric">
            <span>Стоимость</span>
            <strong>{formatCost(router.cost_rub)}</strong>
          </div>
          <span className="like-icon" aria-label="Лайки">
            ♥<b>{router.likes_count}</b>
          </span>
          <Button
            className="next-icon"
            aria-label="Следующий маршрутизатор"
            onClick={handleNext}
          >
            →
          </Button>
        </aside>
      </div>
    </section>
  );
};
