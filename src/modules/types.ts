// Маршрутизатор так, как его отдаёт веб-сервис (GET /api/provider_routers и /feed).
// Поля названы как в JSON бэкенда.
export interface ProviderRouter {
  id: number;
  name: string;
  description: string;
  bandwidth_mbps: number; // пропускная способность, Мбит/с
  cost_rub: number; // стоимость, ₽
  image_url: string; // адрес изображения в MinIO; пусто — изображение по умолчанию
  video_url: string; // адрес видео в MinIO; пусто — видео по умолчанию
  likes_count: number;
  is_liked: 0 | 1; // лайк текущего пользователя (у гостя всегда 0) — только в ленте
  is_own: 0 | 1; // маршрутизатор текущего пользователя — только в списке
  creator_name: string;
  published_at: string;
}

// Черновик создателя (GET /draft, POST, PUT /publish, DELETE)
export interface ProviderRouterDraft {
  id: number;
  name: string;
  description: string;
  status: string;
  bandwidth_mbps: number;
  cost_rub: number;
  image_url: string;
  video_url: string;
}

// Фильтр плитки — как query-параметр min_bandwidth_mbps у GET /api/provider_routers
export interface ProviderRoutersFilter {
  minBandwidthMbps: number;
}

// Ответы сгенерированного клиента описаны в Api.ts типами Serializer…; поля там
// необязательные, поэтому здесь приводим их к типам страниц со значениями по умолчанию.
type Raw<T> = { [K in keyof T]?: (T[K] extends 0 | 1 ? number : T[K]) | null };

export const toProviderRouter = (raw: Raw<ProviderRouter>): ProviderRouter => ({
  id: raw.id ?? 0,
  name: raw.name ?? "",
  description: raw.description ?? "",
  bandwidth_mbps: raw.bandwidth_mbps ?? 0,
  cost_rub: raw.cost_rub ?? 0,
  image_url: raw.image_url ?? "",
  video_url: raw.video_url ?? "",
  likes_count: raw.likes_count ?? 0,
  is_liked: raw.is_liked === 1 ? 1 : 0,
  is_own: raw.is_own === 1 ? 1 : 0,
  creator_name: raw.creator_name ?? "",
  published_at: raw.published_at ?? "",
});

export const toProviderRouterDraft = (
  raw: Raw<ProviderRouterDraft>,
): ProviderRouterDraft => ({
  id: raw.id ?? 0,
  name: raw.name ?? "",
  description: raw.description ?? "",
  status: raw.status ?? "",
  bandwidth_mbps: raw.bandwidth_mbps ?? 0,
  cost_rub: raw.cost_rub ?? 0,
  image_url: raw.image_url ?? "",
  video_url: raw.video_url ?? "",
});
