import { FC } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { ROUTES, ROUTE_LABELS } from "../Routes";

// Нижняя навигационная панель из 4 пунктов. Гостю доступны только «Лента»
// и «Маршрутизаторы» (плитка); «Добавление» и «Вход» отключены до ЛР6.
export const BottomNav: FC = () => (
  <Navbar className="bottom-nav" variant="dark" aria-label="Основная навигация">
    <Nav className="bottom-nav-items">
      <Nav.Link as={NavLink} to={ROUTES.FEED}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="5" y="2.5" width="14" height="19" rx="2.5" />
          <path d="M10 9l5 3-5 3z" className="fill" />
        </svg>
        {ROUTE_LABELS.FEED}
      </Nav.Link>

      <Nav.Link disabled>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
          <path d="M12 8v8M8 12h8" />
        </svg>
        {ROUTE_LABELS.DRAFT}
      </Nav.Link>

      <Nav.Link as={NavLink} to={ROUTES.LIST} end>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
        </svg>
        {ROUTE_LABELS.LIST}
      </Nav.Link>

      <Nav.Link disabled>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c1.2-4 4.3-6 8-6s6.8 2 8 6" />
        </svg>
        {ROUTE_LABELS.LOGIN}
      </Nav.Link>
    </Nav>
  </Navbar>
);
