import { FC, useEffect, useState } from "react";
import { DEFAULT_IMAGE } from "./RouterImage";

// Видео по умолчанию лежит в самом проекте: public/router-default.mp4
export const DEFAULT_VIDEO = "/router-default.mp4";

interface Props {
  src: string; // video_url маршрутизатора, может быть пустым
  poster: string; // image_url — показывается, пока видео грузится
  className?: string;
}

// Видео ленты проигрывается автоматически, без звука и по кругу.
// Пустой video_url или ошибка загрузки — видео по умолчанию; если MinIO
// недоступен, постер тоже заменяется изображением по умолчанию.
export const RouterVideo: FC<Props> = ({ src, poster, className }) => {
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [src]);

  const videoSrc = !src || broken ? DEFAULT_VIDEO : src;

  return (
    <video
      key={videoSrc}
      className={className}
      src={videoSrc}
      poster={!poster || broken ? DEFAULT_IMAGE : poster}
      autoPlay
      muted
      loop
      playsInline
      onError={() => setBroken(true)}
    />
  );
};
