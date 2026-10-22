// Адреса страниц приложения и подписи пунктов нижней навигации
export const ROUTES = {
  FEED: "/provider_routers/feed",
  DRAFT: "/provider_routers/draft",
  LIST: "/provider_routers",
  LOGIN: "/login",
} as const;

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  FEED: "Лента",
  DRAFT: "Добавление",
  LIST: "Маршрутизаторы",
  LOGIN: "Вход",
};
