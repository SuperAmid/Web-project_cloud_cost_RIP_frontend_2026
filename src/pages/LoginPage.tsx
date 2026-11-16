import { FC, FormEvent, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { api, saveToken } from "../api";
import { errorMessage } from "../api/errors";
import { ROUTES } from "../Routes";
import { useAppDispatch, useIsAuth } from "../store";
import { loggedIn } from "../store/authSlice";

// Страница аутентификации. Регистрация в ЛР6 не делается — входят пользователи из seed
// (student@provider-routers.local / password123).
export const LoginPage: FC = () => {
  const isAuth = useIsAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // 8. POST /api/provider_router_users/login → JWT. Запрос выполняет компонент,
  // после успеха меняется состояние приложения: dispatch(loggedIn).
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSending(true);
    setError(null);
    try {
      const { data } = await api.providerRouterUsers.loginProviderRouterUser({ email, password });
      const token = data.access_token ?? "";
      saveToken(token);
      dispatch(loggedIn({ token, userName: data.user?.display_name ?? email }));
      navigate(ROUTES.FEED);
    } catch (err) {
      setError(errorMessage(err, "Не удалось войти: веб-сервис недоступен"));
    } finally {
      setSending(false);
    }
  };

  if (isAuth) {
    return <Navigate to={ROUTES.FEED} replace />;
  }

  return (
    <div className="page-grid-content">
      <header className="page-header">
        <p className="eyebrow">Сеть провайдера · ЛР6</p>
        <h1>Вход</h1>
        <p>Войдите, чтобы добавлять маршрутизаторы, ставить лайки и удалять свои.</p>
      </header>

      <Form className="form-card" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            maxLength={120}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="student@provider-routers.local"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            required
            minLength={6}
            maxLength={72}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Form.Group>
        {error && <Alert variant="danger">{error}</Alert>}
        <Button className="action-button" type="submit" disabled={sending}>
          {sending ? "Вход…" : "Войти"}
        </Button>
      </Form>
    </div>
  );
};
