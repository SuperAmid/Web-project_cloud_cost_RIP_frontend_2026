import { isAxiosError } from "axios";

// Текст ошибки для пользователя: веб-сервис отвечает {"error": "..."}
export const errorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    const data = error.response?.data as { error?: string } | undefined;
    if (data?.error) return data.error;
  }
  return fallback;
};

export const errorStatus = (error: unknown): number | undefined =>
  isAxiosError(error) ? error.response?.status : undefined;

// Веб-сервис недоступен: нет ответа или прокси Vite вернул 5xx (бэкенд не запущен).
// В этом случае гостевые страницы показывают коллекцию mock-объектов.
export const isBackendDown = (error: unknown): boolean => {
  if (!isAxiosError(error)) return false;
  const status = error.response?.status;
  return status === undefined || status >= 500;
};
