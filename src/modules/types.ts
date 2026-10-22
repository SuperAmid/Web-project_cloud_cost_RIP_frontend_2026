// Маршрутизатор так, как его отдаёт веб-сервис (GET /api/provider_routers и /feed).
// Поля названы как в JSON бэкенда, чтобы в ЛР6 подставить ответ сервера без переделки.
export interface ProviderRouter {
  id: number;
  name: string;
  description: string;
  bandwidth_mbps: number; // пропускная способность, Мбит/с
  cost_rub: number; // стоимость, ₽
  image_url: string; // адрес изображения в MinIO; пусто — изображение по умолчанию
  video_url: string; // адрес видео в MinIO; пусто — видео по умолчанию
  likes_count: number;
  is_liked: 0 | 1; // лайк текущего пользователя (у гостя всегда 0)
  creator_name: string;
  published_at: string;
}

// Фильтр плитки — как query-параметр min_bandwidth_mbps у GET /api/provider_routers
export interface ProviderRoutersFilter {
  minBandwidthMbps: number;
}
