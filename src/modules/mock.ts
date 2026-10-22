import { ProviderRouter } from "./types";

// Адрес бакета MinIO, как его формирует бэкенд: http://localhost:9000/<bucket>/<ключ>
const MINIO = "http://localhost:9000/provider-media";

// Коллекция mock-объектов: только опубликованные маршрутизаторы (черновик и удалённые
// гостю не показываются). У последних двух записей пустые image_url / video_url —
// на них видно изображение и видео по умолчанию из папки public проекта.
export const PROVIDER_ROUTERS_MOCK: ProviderRouter[] = [
  {
    id: 101,
    name: "Core Backbone One",
    description:
      "Центральный маршрутизатор ядра провайдера для магистрального узла и распределения трафика между сегментами сети.",
    bandwidth_mbps: 100000,
    cost_rub: 980000,
    image_url: `${MINIO}/provider_routers/core.svg`,
    video_url: `${MINIO}/videos/core-loop.mp4`,
    likes_count: 2,
    is_liked: 0,
    creator_name: "Оператор сети",
    published_at: "2026-10-19T23:16:42+03:00",
  },
  {
    id: 102,
    name: "North Ring Hub",
    description:
      "Промежуточный маршрутизатор кольцевой сети, который агрегирует районные узлы и передаёт трафик на магистраль.",
    bandwidth_mbps: 10000,
    cost_rub: 310000,
    image_url: `${MINIO}/provider_routers/ring.svg`,
    video_url: `${MINIO}/videos/ring-loop.mp4`,
    likes_count: 1,
    is_liked: 0,
    creator_name: "Оператор сети",
    published_at: "2026-10-19T23:16:42+03:00",
  },
  {
    id: 103,
    name: "Harbor Residence Gateway",
    description:
      "Конечный маршрутизатор жилого комплекса для распределения доступа к сети между квартирами.",
    bandwidth_mbps: 1000,
    cost_rub: 72000,
    image_url: `${MINIO}/provider_routers/residential.svg`,
    video_url: `${MINIO}/videos/residential-loop.mp4`,
    likes_count: 2,
    is_liked: 0,
    creator_name: "Оператор сети",
    published_at: "2026-10-19T23:16:42+03:00",
  },
  {
    id: 106,
    name: "Ozerki Residence Gateway",
    description: "Конечный маршрутизатор ЖК «Озерки» на 240 квартир.",
    bandwidth_mbps: 2500,
    cost_rub: 84000,
    image_url: "",
    video_url: "",
    likes_count: 0,
    is_liked: 0,
    creator_name: "Студент РИП",
    published_at: "2026-10-22T11:07:18+03:00",
  },
  {
    id: 107,
    name: "East Metro Aggregator",
    description:
      "Агрегирующий маршрутизатор районной сети: собирает трафик домовых узлов и передаёт его в кольцо.",
    bandwidth_mbps: 40000,
    cost_rub: 455000,
    image_url: "",
    video_url: `${MINIO}/videos/ring-loop.mp4`,
    likes_count: 3,
    is_liked: 0,
    creator_name: "Оператор сети",
    published_at: "2026-10-22T12:00:00+03:00",
  },
];
