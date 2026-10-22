import { FC, useEffect, useState } from "react";
import { Image } from "react-bootstrap";

// Изображение по умолчанию лежит в самом проекте: public/router-default.jpg
export const DEFAULT_IMAGE = "/router-default.jpg";

interface Props {
  src: string; // image_url маршрутизатора, может быть пустым
  alt: string;
  className?: string;
}

// Картинка маршрутизатора: пустой image_url или ошибка загрузки (MinIO не запущен,
// файла нет) — показываем изображение по умолчанию.
export const RouterImage: FC<Props> = ({ src, alt, className }) => {
  const [broken, setBroken] = useState(false);

  // Новый адрес — новая попытка загрузки
  useEffect(() => {
    setBroken(false);
  }, [src]);

  return (
    <Image
      className={className}
      src={!src || broken ? DEFAULT_IMAGE : src}
      alt={alt}
      onError={() => setBroken(true)}
    />
  );
};
