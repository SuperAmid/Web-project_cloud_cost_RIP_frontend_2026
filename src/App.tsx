import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { DraftPage } from "./pages/DraftPage";
import { FeedPage } from "./pages/FeedPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProviderRoutersPage } from "./pages/ProviderRoutersPage";
import { ROUTES } from "./Routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to={ROUTES.FEED} replace />} />
          <Route path={ROUTES.FEED} element={<FeedPage />} />
          <Route path={`${ROUTES.FEED}/:id`} element={<FeedPage />} />
          <Route path={ROUTES.LIST} element={<ProviderRoutersPage />} />
          <Route path={ROUTES.DRAFT} element={<DraftPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
