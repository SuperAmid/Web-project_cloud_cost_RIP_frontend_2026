import { FC, useEffect } from "react";
import { Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BandwidthFilter } from "../components/BandwidthFilter";
import { ProviderRouterTile } from "../components/ProviderRouterTile";
import { ROUTES } from "../Routes";
import { useAppDispatch, useAppSelector, useIsAuth } from "../store";
import {
  deleteProviderRouter,
  fetchProviderRouters,
  filterApplied,
  sliderChanged,
} from "../store/providerRoutersSlice";

// Плитка: опубликованные маршрутизаторы в 2 столбца и фильтр по пропускной способности.
// Значение слайдера и применённый фильтр хранятся в Redux, поэтому сохраняются
// при переходе на другие страницы и обратно.
export const ProviderRoutersPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuth = useIsAuth();
  const { sliderValue, minBandwidthMbps, items, loading, fromMock, error } = useAppSelector(
    (state) => state.providerRouters,
  );

  // Список загружается при открытии страницы, после применения фильтра и после входа/выхода
  // (от токена зависит is_own)
  useEffect(() => {
    dispatch(fetchProviderRouters(minBandwidthMbps));
  }, [dispatch, minBandwidthMbps, isAuth]);

  return (
    <div className="page-grid-content">
      <header className="page-header">
        <p className="eyebrow">Сеть провайдера · ЛР6</p>
        <h1>Маршрутизаторы</h1>
        <p>
          {fromMock
            ? "Веб-сервис недоступен — показаны mock-данные."
            : "Показаны опубликованные маршрутизаторы."}
        </p>
      </header>

      <BandwidthFilter
        value={sliderValue}
        min={0}
        max={100000}
        step={1000}
        onChange={(value) => dispatch(sliderChanged(value))}
        onSubmit={() => dispatch(filterApplied())}
      />

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="page-loader">
          <Spinner animation="border" />
        </div>
      ) : items.length === 0 ? (
        <p className="empty-state">Маршрутизаторы с таким значением не найдены.</p>
      ) : (
        <section className="provider_router_grid">
          {items.map((item) => (
            <ProviderRouterTile
              key={item.id}
              {...item}
              canDelete={isAuth && item.is_own === 1}
              onDelete={() => dispatch(deleteProviderRouter(item.id))}
              onClick={() => navigate(`${ROUTES.FEED}/${item.id}`)}
            />
          ))}
        </section>
      )}
    </div>
  );
};
