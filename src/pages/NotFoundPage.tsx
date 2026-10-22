import { FC } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../Routes";

export const NotFoundPage: FC = () => (
  <div className="page-message">
    <p className="eyebrow">Ошибка 404</p>
    <h1>Страница не найдена</h1>
    <Link className="btn action-button" to={ROUTES.FEED}>
      Открыть ленту
    </Link>
  </div>
);
