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

// JWT — единственное, что хранится в Local Storage. После F5 он остаётся там
// (его видно во вкладке Application), но приложение начинает в состоянии гостя
// и токен не отправляет, пока пользователь снова не войдёт.
export const saveToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
  api.setSecurityData(token);
};
