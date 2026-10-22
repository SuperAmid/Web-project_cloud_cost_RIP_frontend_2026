import { FC, useEffect, useState } from "react";

const formatTime = (date: Date) =>
  date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

// Строка состояния телефона в рамке на компьютере: время обновляется раз в 10 с.
// useEffect с пустым массивом зависимостей запускает таймер при монтировании,
// а функция очистки останавливает его при размонтировании компонента.
export const StatusBar: FC = () => {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const timer = setInterval(() => setTime(formatTime(new Date())), 10_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="status-bar" aria-hidden="true">
      <span className="sb-time">{time}</span>
      <span className="sb-camera" />
      <span className="sb-icons">
        <svg viewBox="0 0 18 12">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg viewBox="0 0 16 12">
          <path d="M8 11.5 1 4.3a10 10 0 0 1 14 0z" />
        </svg>
        <span className="sb-battery">
          <span className="sb-level" />
        </span>
        <span className="sb-percent">87%</span>
      </span>
    </div>
  );
};
