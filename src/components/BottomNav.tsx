import { FC } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { api, saveToken } from "../api";
import { LOGOUT_LABEL, ROUTES, ROUTE_LABELS } from "../Routes";
import { useAppDispatch, useIsAuth } from "../store";
import { loggedOut } from "../store/authSlice";

// Нижняя навигационная панель из 4 пунктов. Гостю «Добавление» недоступно,
// четвёртый пункт — «Вход»; после входа «Добавление» открывается, а вместо
// «Вход» показан «Выход».
export const BottomNav: FC = () => {
  const isAuth = useIsAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // 9. POST /api/provider_router_users/logout — токен попадает в blacklist Redis.
  // Запрос авторизации выполняет сам компонент, в store уходит только результат.
  const handleLogout = async () => {
    try {
      await api.providerRouterUsers.logoutProviderRouterUser();
    } catch {
      // токен уже недействителен — всё равно выходим на клиенте
    }
    saveToken(null);
    dispatch(loggedOut());
    navigate(ROUTES.FEED);
  };

  return (
    <Navbar className="bottom-nav" variant="dark" aria-label="Основная навигация">
      <Nav className="bottom-nav-items">
        <Nav.Link as={NavLink} to={ROUTES.FEED}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="5" y="2.5" width="14" height="19" rx="2.5" />
            <path d="M10 9l5 3-5 3z" className="fill" />
          </svg>
          {ROUTE_LABELS.FEED}
        </Nav.Link>

        {isAuth ? (
          <Nav.Link as={NavLink} to={ROUTES.DRAFT}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            {ROUTE_LABELS.DRAFT}
          </Nav.Link>
        ) : (
          <Nav.Link disabled>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            {ROUTE_LABELS.DRAFT}
          </Nav.Link>
        )}

        <Nav.Link as={NavLink} to={ROUTES.LIST} end>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
            <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
            <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
            <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
          </svg>
          {ROUTE_LABELS.LIST}
        </Nav.Link>

        {isAuth ? (
          <Nav.Link as="button" type="button" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
              <path d="M10 8l-4 4 4 4M6 12h10" />
            </svg>
            {LOGOUT_LABEL}
          </Nav.Link>
        ) : (
          <Nav.Link as={NavLink} to={ROUTES.LOGIN}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c1.2-4 4.3-6 8-6s6.8 2 8 6" />
            </svg>
            {ROUTE_LABELS.LOGIN}
          </Nav.Link>
        )}
      </Nav>
    </Navbar>
  );
};
