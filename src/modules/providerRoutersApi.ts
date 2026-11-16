import { PROVIDER_ROUTERS_MOCK } from "./mock";
import { ProviderRouter, ProviderRoutersFilter } from "./types";

// Запасной вариант из ЛР5: если веб-сервис недоступен (не запущен, прокси вернул 5xx),
// гостевые страницы берут данные из коллекции mock-объектов. Основные запросы —
// в src/store через сгенерированный по swagger клиент (src/api).

// Как GET /api/provider_routers?min_bandwidth_mbps=…
export const getProviderRoutersMock = async (
  filter: ProviderRoutersFilter,
): Promise<ProviderRouter[]> =>
  PROVIDER_ROUTERS_MOCK.filter(
    (item) => item.bandwidth_mbps >= filter.minBandwidthMbps,
  );

// Как GET /api/provider_routers/feed[?id=…[&next=true]]
export const getProviderRouterFeedMock = async (
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
