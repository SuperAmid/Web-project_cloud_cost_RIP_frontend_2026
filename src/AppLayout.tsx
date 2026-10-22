import { FC } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import { StatusBar } from "./components/StatusBar";
import { ROUTES } from "./Routes";

// Общая обёртка всех страниц: «телефон» со строкой состояния, содержимое
// текущей страницы (Outlet) и нижняя навигация.
export const AppLayout: FC = () => {
  const { pathname } = useLocation();
  // класс страницы: лента — видео во весь экран и тёмная строка состояния
  const pageClass = pathname.startsWith(ROUTES.FEED) ? "page-feed" : "page-grid";

  return (
    <div className={`phone ${pageClass}`}>
      <StatusBar />
      <main className="phone-shell">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};
