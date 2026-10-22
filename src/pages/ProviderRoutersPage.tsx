import { FC, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BandwidthFilter } from "../components/BandwidthFilter";
import { ProviderRouterTile } from "../components/ProviderRouterTile";
import { getProviderRouters } from "../modules/providerRoutersApi";
import { ProviderRouter } from "../modules/types";
import { ROUTES } from "../Routes";

// Плитка: все опубликованные маршрутизаторы в 2 столбца и фильтр по пропускной
// способности. Применённый фильтр хранится в адресе (?min_bandwidth_mbps=10000),
// поэтому сохраняется после поиска, при обновлении страницы и кнопке «Назад».
export const ProviderRoutersPage: FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const appliedBandwidth = Number(searchParams.get("min_bandwidth_mbps") ?? 0);

  const [bandwidth, setBandwidth] = useState(appliedBandwidth); // значение слайдера
  const [routers, setRouters] = useState<ProviderRouter[]>([]);
  const [loading, setLoading] = useState(true);

  // Список загружается при открытии страницы и после каждого применения фильтра
  useEffect(() => {
    setLoading(true);
    getProviderRouters({ minBandwidthMbps: appliedBandwidth }).then((items) => {
      setRouters(items);
      setLoading(false);
    });
  }, [appliedBandwidth]);

  // Слайдер всегда показывает фильтр из адреса (например, после «Назад»)
  useEffect(() => {
    setBandwidth(appliedBandwidth);
  }, [appliedBandwidth]);

  const handleFilter = () => {
    setSearchParams(bandwidth ? { min_bandwidth_mbps: String(bandwidth) } : {});
  };

  return (
    <div className="page-grid-content">
      <header className="page-header">
        <p className="eyebrow">Сеть провайдера · ЛР5</p>
        <h1>Маршрутизаторы</h1>
        <p>Показаны опубликованные маршрутизаторы.</p>
      </header>

      <BandwidthFilter
        value={bandwidth}
        min={0}
        max={100000}
        step={1000}
        onChange={setBandwidth}
        onSubmit={handleFilter}
      />

      {loading ? (
        <div className="page-loader">
          <Spinner animation="border" />
        </div>
      ) : routers.length === 0 ? (
        <p className="empty-state">Маршрутизаторы с таким значением не найдены.</p>
      ) : (
        <section className="provider_router_grid">
          {routers.map((item) => (
            <ProviderRouterTile
              key={item.id}
              {...item}
              onClick={() => navigate(`${ROUTES.FEED}/${item.id}`)}
            />
          ))}
        </section>
      )}
    </div>
  );
};
