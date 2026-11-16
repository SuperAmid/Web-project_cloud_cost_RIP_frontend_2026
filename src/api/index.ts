import { Api } from "./Api";

// Api.ts генерируется из swagger.json веб-сервиса (ЛР4) командой
//   npm run generate-api
// (swagger-typescript-api, шаблон axios). Имена методов взяты из operationId:
//   api.providerRouters.getProviderRouters / getProviderRouterFeed / getProviderRouterDraft /
//   createProviderRouter / publishProviderRouter / deleteProviderRouter / likeProviderRouter
//   api.providerRouterUsers.loginProviderRouterUser / logoutProviderRouterUser
// Все запросы идут на /api — Vite проксирует их на веб-сервис http://localhost:8080,
// поэтому CORS не нужен.

const TOKEN_KEY = "provider_routers_token";

// securityWorker вызывается сгенерированным клиентом для методов с BearerAuth:
// если пользователь вошёл, к запросу добавляется заголовок Authorization.
export const api = new Api<string>({
  baseURL: "/api",
  securityWorker: (token) =>
    token ? { headers: { Authorization: `Bearer ${token}` } } : {},
});

// JWT — единственное, что хранится в Local Storage: после F5 пользователь остаётся
// авторизованным, пока токен действует.
export const loadToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const saveToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
  api.setSecurityData(token);
};

// Токен, сохранённый до перезагрузки страницы, сразу передаём клиенту
api.setSecurityData(loadToken());
