import { PROVIDER_ROUTERS_MOCK } from "./mock";
import { ProviderRouter, ProviderRoutersFilter } from "./types";

// В ЛР5 содержимое карточек берётся только из коллекции mock-объектов, без бэкенда.
// Функции повторяют методы веб-сервиса и возвращают Promise, поэтому в ЛР6 вместо
// mock здесь появится fetch/axios к /api, а страницы останутся без изменений.

// Аналог GET /api/provider_routers?min_bandwidth_mbps=… — плитка с фильтром
export const getProviderRouters = async (
  filter: ProviderRoutersFilter,
): Promise<ProviderRouter[]> =>
  PROVIDER_ROUTERS_MOCK.filter(
    (item) => item.bandwidth_mbps >= filter.minBandwidthMbps,
  );

// Аналог GET /api/provider_routers/feed[?id=…[&next=true]] — одна карточка ленты.
// Без id — первая карточка; с next — следующая после id (после последней — снова первая).
export const getProviderRouterFeed = async (
  id?: number,
  next = false,
): Promise<ProviderRouter | undefined> => {
  const list = PROVIDER_ROUTERS_MOCK;
  if (id === undefined) {
    return list[0];
  }
  const index = list.findIndex((item) => item.id === id);
  if (index === -1) {
    return undefined;
  }
  return next ? list[(index + 1) % list.length] : list[index];
};
