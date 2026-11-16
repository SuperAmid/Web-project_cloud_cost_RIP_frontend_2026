# provider_routers — фронтенд (ЛР5–ЛР6)

Лабораторные работы №5–6 курса «Разработка интернет-приложений». ЛР5 — базовое SPA на **React + TypeScript** (сборщик **Vite**, компоненты **React-Bootstrap**, роутинг **react-router-dom**) для темы «Маршрутизаторы сети провайдера». Интерфейс гостя повторяет две страницы ЛР1 — **ленту** и **плитку** — в том же стиле (цвета, кнопки и нижняя навигация из ЛР1–ЛР2). ЛР6 — подключение веб-сервиса: все запросы через сгенерированный из Swagger клиент на Axios, состояние в Redux Toolkit, вход и выход, интерфейс создателя (добавление, лайки, удаление).

Бэкенд (веб-сервис на Go): [Web-project_cloud_cost_RIP_backend_2026](https://github.com/SuperAmid/Web-project_cloud_cost_RIP_backend_2026).

## Запуск

Нужен [Node.js](https://nodejs.org/) 18 или новее и запущенный веб-сервис из ветки [`swagger-codegen`](https://github.com/SuperAmid/Web-project_cloud_cost_RIP_backend_2026/tree/swagger-codegen) бэкенда (`docker compose up -d`, `go run .`).

```bash
npm install
npm run generate-api   # клиент API из swagger/swagger.json → src/api/Api.ts
npm run dev
```

Приложение открывается на `http://localhost:3000`. Сборка для продакшена — `npm run build`, результат в `dist/`.

Все запросы идут на `/api`, Vite проксирует их на веб-сервис `http://localhost:8080` (`vite.config.ts`), поэтому CORS не нужен. Изображения и видео загружаются из MinIO по `image_url` / `video_url` (`http://localhost:9000/provider-media/...`); пустой адрес или ошибка загрузки — файлы по умолчанию из папки `public`. Если веб-сервис не запущен, лента и плитка показывают коллекцию mock-объектов из ЛР5 (`src/modules/mock.ts`).

## ЛР6: Redux Toolkit, Axios и кодогенерация из Swagger

### Кодогенерация

`swagger/swagger.json` — описание веб-сервиса из ЛР4 (swaggo), у каждого метода есть `operationId`. Команда `npm run generate-api` запускает `swagger-typescript-api` с шаблоном **axios** и создаёт `src/api/Api.ts`: интерфейсы сущностей бэкенда и класс `Api` с методами по доменам. В коде используются только сгенерированные методы, `fetch` и ручных `axios.get` нет. Экземпляр клиента — `src/api/index.ts`: `baseURL: "/api"` и `securityWorker`, который добавляет `Authorization: Bearer <JWT>` к методам с BearerAuth.

### 9 AJAX-запросов к веб-сервису

Регистрация в ЛР6 не делается, остальные 9 методов вызываются из интерфейса:

| № | Метод веб-сервиса | Сгенерированный метод | Где вызывается |
| --- | --- | --- | --- |
| 1 | `GET /api/provider_routers?min_bandwidth_mbps=` | `api.providerRouters.getProviderRouters` | плитка, кнопка «Фильтровать» — thunk `fetchProviderRouters` |
| 2 | `GET /api/provider_routers/feed?id=&next=` | `api.providerRouters.getProviderRouterFeed` | лента и кнопка «→» — thunk `fetchFeed` |
| 3 | `GET /api/provider_routers/draft` | `api.providerRouters.getProviderRouterDraft` | открытие «Добавления» — thunk `fetchDraft` |
| 4 | `POST /api/provider_routers` (multipart) | `api.providerRouters.createProviderRouter` | «Добавление», кнопка «Далее» — thunk `createDraft` |
| 5 | `PUT /api/provider_routers/{id}/publish` | `api.providerRouters.publishProviderRouter` | «Добавление», кнопка «Опубликовать» — thunk `publishDraft` |
| 6 | `DELETE /api/provider_routers/{id}` | `api.providerRouters.deleteProviderRouter` | плитка, «Удалить» у своих карточек; «Удалить черновик» — thunk `deleteProviderRouter` |
| 7 | `POST /api/provider_routers/{id}/like` | `api.providerRouters.likeProviderRouter` | лента, ♥ у создателя — thunk `toggleLike` |
| 8 | `POST /api/provider_router_users/login` | `api.providerRouterUsers.loginProviderRouterUser` | страница «Вход» — в компоненте `LoginPage` |
| 9 | `POST /api/provider_router_users/logout` | `api.providerRouterUsers.logoutProviderRouterUser` | пункт «Выход» — в компоненте `BottomNav` |

### Redux Toolkit

Хранилище `src/store` (`configureStore`, thunk middleware по умолчанию):

| Slice | Что хранит | Как меняется |
| --- | --- | --- |
| `auth` | JWT и имя пользователя | actions `loggedIn` / `loggedOut`; запросы входа и выхода выполняет компонент |
| `providerRouters` | значение слайдера, применённый фильтр, список, флаг mock | async thunk `fetchProviderRouters`, `deleteProviderRouter`; actions `sliderChanged`, `filterApplied` |
| `feed` | текущая карточка ленты | async thunk `fetchFeed`, `toggleLike` |
| `draft` | черновик создателя | async thunk `fetchDraft`, `createDraft`, `publishDraft` |

Компоненты вызывают `dispatch(action)` из событий (`useAppDispatch`) и получают данные через `useAppSelector`. Значение фильтра лежит в store, поэтому сохраняется при переходе между страницами.

### Авторизация

- **Вход** (`/login`): email и пароль, после успеха JWT сохраняется в Local Storage (только он), в store — `loggedIn`, переход в ленту. Пользователь из seed: `student@provider-routers.local` / `password123`.
- После входа меняется интерфейс: открывается «Добавление», вместо «Вход» — **«Выход»**, в ленте ♥ нажимается (лайк ставится и снимается), в плитке у своих карточек (`is_own = 1`) есть «Удалить».
- **Выход**: запрос logout (токен попадает в blacklist Redis), токен удаляется из Local Storage, `loggedOut`.
- После F5 токен берётся из Local Storage, пользователь остаётся авторизованным.

### Добавление

Шаг 1 — название, изображение и видео; выбранные файлы сразу видны в превью. «Далее» сохраняет черновик (файлы уходят в MinIO), и на странице появляются изображение и видео уже с сервера. Шаг 2 — описание, пропускная способность и стоимость; «Опубликовать» открывает новую карточку в ленте. Черновик можно удалить.

## Страницы

В приложении **4 страницы** — те же, что в ТЗ и на диаграмме классов: **Лента**, **Добавление**, **Маршрутизаторы** (плитка) и **Вход и регистрация**. В ЛР5 работали только лента и плитка (интерфейс гостя), в ЛР6 подключены все четыре.

| № | Страница | Адрес | Кому доступна | Метод веб-сервиса | ЛР6 |
| --- | --- | --- | --- | --- | --- |
| 1 | Лента | `/provider_routers/feed`, `/provider_routers/feed/:id` | всем | `GET /api/provider_routers/feed` (`id`, `next`), лайк — `POST /api/provider_routers/{id}/like` | работает с веб-сервисом |
| 2 | Добавление | `/provider_routers/draft` | создателю (после входа) | `GET /api/provider_routers/draft`, `POST /api/provider_routers`, `PUT /api/provider_routers/{id}/publish` | работает после входа |
| 3 | Маршрутизаторы (плитка) | `/provider_routers` | всем | `GET /api/provider_routers?min_bandwidth_mbps=` , удаление — `DELETE /api/provider_routers/{id}` | работает с веб-сервисом |
| 4 | Вход и регистрация | `/login` | гостю | `POST /api/provider_router_users/login`, `POST /api/provider_router_users/register`; выход — `POST /api/provider_router_users/logout` | работает (без регистрации) |

Все страницы открываются в рамке телефона (на компьютере — по центру экрана, на телефоне — во весь экран). Снизу на каждой странице — навигационная панель из 4 пунктов.

### Нижняя навигационная панель

| Пункт | Адрес | Доступность |
| --- | --- | --- |
| Лента | `/provider_routers/feed` | доступен, подсвечивается на странице ленты |
| Добавление | `/provider_routers/draft` | гостю недоступен (серый, не нажимается); после входа открывает страницу 2 |
| Маршрутизаторы | `/provider_routers` | доступен, подсвечивается на странице плитки |
| Вход / Выход | `/login` | гостю — «Вход» (страница 4); после входа — «Выход» (вызов logout) |

### 1. Лента — `/provider_routers/feed` и `/provider_routers/feed/:id`

Одна карточка маршрутизатора на весь экран. Без `id` открывается первая карточка, с `id` — карточка с этим id (переход из плитки).

| Элемент | Что делает |
| --- | --- |
| Видео на весь экран | проигрывается автоматически, без звука и по кругу; пока грузится — изображение маршрутизатора. Пустой `video_url` или недоступный MinIO — видео и изображение по умолчанию |
| Подпись «Маршрутизатор · #id», название | текст поверх видео слева |
| Описание | не больше двух строк |
| Кнопка «Ещё» / «Скрыть» | раскрывает и сворачивает полное описание |
| Поле «Пропускная способность» | первое поле по теме, справа (Мбит/с или Гбит/с) |
| Поле «Стоимость» | второе поле по теме, справа (₽) |
| ♥ и число | количество лайков; гость только видит число, создатель нажатием ставит и снимает лайк (`POST /{id}/like`, `like` = 1 / 0), сердце закрашено, если `is_liked = 1` |
| Красная кнопка «→» | следующий маршрутизатор, как `GET /feed?id=…&next=true`; после последнего — снова первый |

Если маршрутизатора с таким id нет — сообщение «Маршрутизатор не найден» и кнопка «К началу ленты».

### 2. Добавление — `/provider_routers/draft`

Доступна создателю (авторизованному пользователю), у гостя пункт «Добавление» неактивен. Маршрутизатор добавляется в два шага: сначала черновик с файлами, затем публикация с полями по теме. У пользователя может быть только один черновик.

| Элемент | Что делает |
| --- | --- |
| Загрузка черновика при открытии | `GET /api/provider_routers/draft`; если черновик уже есть — поля и превью заполняются из него, иначе форма пустая |
| Поле «Изображение» | выбор файла `.jpg .jpeg .png .webp .svg` до 10 МБ, превью; после сохранения — изображение из MinIO по `image_url` |
| Поле «Видео» | выбор файла `.mp4 .webm .mov` до 50 МБ, превью; после сохранения — видео из MinIO по `video_url` |
| Поле «Название» | обязательное, до 120 символов |
| Кнопка «Далее» | `POST /api/provider_routers` (multipart: `name`, `image`, `video`) — создаёт черновик со статусом `draft`, файлы сохраняются в MinIO |
| Поле «Описание» | до 500 символов |
| Поле «Пропускная способность, Мбит/с» | первое поле по теме, целое число больше 0 |
| Поле «Стоимость, ₽» | второе поле по теме, целое число больше 0 |
| Кнопка «Опубликовать» | `PUT /api/provider_routers/{id}/publish` с описанием, пропускной способностью и стоимостью; статус становится `published`, дата публикации ставится на сервере; после успеха — переход в ленту на новую карточку |

Ошибки сервера (`400` — не заполнены поля, `409` — черновик уже есть) показываются над кнопкой.

### 3. Маршрутизаторы (плитка) — `/provider_routers`

Все опубликованные маршрутизаторы в два столбца и фильтр по пропускной способности.

| Элемент | Что делает |
| --- | --- |
| Слайдер «Мин. пропускная способность» | от 0 до 100 000 Мбит/с с шагом 1000, выбранное значение показано рядом с подписью |
| Кнопка «Фильтровать» | применяет фильтр: `GET /api/provider_routers?min_bandwidth_mbps=10000`. Значение слайдера и фильтр хранятся в Redux и сохраняются при переходе на другие страницы и обратно |
| Карточка | изображение (по умолчанию, если `image_url` пустой или файл не загрузился), название, пропускная способность, стоимость, ♥ и количество лайков |
| Нажатие на карточку | открывает ленту, начиная с этой карточки |
| Кнопка «Удалить» | только у своих карточек создателя (`is_own = 1`): `DELETE /api/provider_routers/{id}`, карточка пропадает из плитки (логическое удаление, статус `deleted`). У гостя кнопки нет |

Если под фильтр ничего не подходит — «Маршрутизаторы с таким значением не найдены».

### 4. Вход и регистрация — `/login`

Доступна гостю, у создателя вместо пункта «Вход» в навигации — «Выход». В ЛР6 — только вход, регистрация не делается (поле «Имя» и кнопка «Зарегистрироваться» относятся к полной версии).

| Элемент | Что делает |
| --- | --- |
| Поле «Email» | обязательное, формат email, до 120 символов |
| Поле «Имя» | только в режиме регистрации, до 80 символов |
| Поле «Пароль» | обязательное, от 6 до 72 символов, ввод скрыт |
| Кнопка «Войти» | `POST /api/provider_router_users/login` → JWT `access_token`; токен сохраняется в Local Storage и подставляется в заголовок `Authorization: Bearer …` следующих запросов; переход в ленту, в навигации открываются «Добавление» и «Выход» |
| Кнопка «Зарегистрироваться» | `POST /api/provider_router_users/register` с email, именем и паролем; после успеха форма переключается на вход с тем же email |
| Пункт навигации «Выход» (у создателя) | `POST /api/provider_router_users/logout` — токен попадает в blacklist Redis, приложение забывает его и возвращается к интерфейсу гостя |

Ошибки (`401` — неверный email или пароль) показываются под формой.

### Служебная страница 404 — любой другой адрес

Сообщение «Страница не найдена» и кнопка «Открыть ленту».

## Изображение и видео по умолчанию

Файлы лежат в самом проекте: `public/router-default.jpg` и `public/router-default.mp4`.

- `src/components/RouterImage.tsx` — картинка карточки: пустой `image_url` или ошибка загрузки (`onError`) → `/router-default.jpg`.
- `src/components/RouterVideo.tsx` — видео ленты: пустой `video_url` или ошибка загрузки → `/router-default.mp4`, постер — изображение маршрутизатора или изображение по умолчанию.

В mock у маршрутизатора 106 пустые `image_url` и `video_url`, у 107 — пустой `image_url`.

## Структура кода

| Файл | Что внутри |
| --- | --- |
| `swagger/swagger.json` | описание веб-сервиса из ЛР4 — вход для кодогенерации |
| `src/api/Api.ts` | **сгенерирован** `npm run generate-api`: типы и класс `Api` (axios) |
| `src/api/index.ts` | экземпляр `api` (`baseURL: "/api"`, `securityWorker` с JWT), сохранение токена в Local Storage |
| `src/api/errors.ts` | текст ошибки из ответа, проверка «веб-сервис недоступен» |
| `src/store/index.ts` | `configureStore`, типизированные `useAppDispatch`, `useAppSelector`, `useIsAuth` |
| `src/store/authSlice.ts` | slice авторизации: `loggedIn`, `loggedOut` |
| `src/store/providerRoutersSlice.ts` | плитка: фильтр, список, thunk `fetchProviderRouters`, `deleteProviderRouter` |
| `src/store/feedSlice.ts` | лента: thunk `fetchFeed`, `toggleLike` |
| `src/store/draftSlice.ts` | добавление: thunk `fetchDraft`, `createDraft`, `publishDraft` |
| `src/main.tsx` | точка входа: Bootstrap CSS, стили, `Provider store` и `App` |
| `src/App.tsx` | роутинг: `BrowserRouter`, общая обёртка `AppLayout` и 4 страницы |
| `src/Routes.ts` | адреса страниц и подписи пунктов навигации |
| `src/AppLayout.tsx` | рамка телефона: строка состояния, `Outlet` с текущей страницей, нижняя навигация |
| `src/pages/FeedPage.tsx` | лента и лайк |
| `src/pages/ProviderRoutersPage.tsx` | плитка с фильтром и удалением своих |
| `src/pages/DraftPage.tsx` | добавление: черновик с файлами и публикация |
| `src/pages/LoginPage.tsx` | вход |
| `src/pages/NotFoundPage.tsx` | 404 |
| `src/components/BandwidthFilter.tsx` | фильтр: слайдер `Form.Range` и кнопка |
| `src/components/ProviderRouterTile.tsx` | карточка плитки (`Card`) с кнопкой «Удалить» у своих |
| `src/components/RouterImage.tsx`, `RouterVideo.tsx` | изображение и видео с заменой на файлы по умолчанию |
| `src/components/BottomNav.tsx` | нижняя навигация, «Вход» / «Выход» |
| `src/components/StatusBar.tsx` | строка состояния телефона с часами |
| `src/modules/types.ts` | типы `ProviderRouter`, `ProviderRouterDraft` и приведение ответов клиента к ним |
| `src/modules/mock.ts`, `providerRoutersApi.ts` | mock-объекты ЛР5 — запасной вариант, если веб-сервис недоступен |
| `src/styles.css` | стили приложения (подключаются после Bootstrap) |

## Хуки

| Хук | Где | Зачем |
| --- | --- | --- |
| `useAppDispatch` (`useDispatch`) | все страницы, `BottomNav` | вызвать action или thunk из события |
| `useAppSelector` (`useSelector`) | все страницы, `BottomNav` | получить данные из store для отрисовки |
| `useState` | `FeedPage`, `DraftPage`, `LoginPage`, `RouterImage`, `RouterVideo`, `StatusBar` | «Ещё», поля форм, выбранные файлы, признак ошибки загрузки файла, время |
| `useEffect` | страницы, `RouterImage`, `RouterVideo`, `StatusBar` | загрузка данных при открытии страницы, смене id, фильтра или входе; превью файла с `URL.revokeObjectURL`; таймер часов |
| `useRef` | `FeedPage` | не запрашивать карточку повторно после «→» |
| `useParams` | `FeedPage` | `id` маршрутизатора из адреса |
| `useNavigate` | страницы, `BottomNav` | переходы после «→», публикации, входа и выхода |
| `useLocation` | `AppLayout` | класс текущей страницы для оформления ленты |
