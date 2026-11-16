import { FC, MouseEvent } from "react";
import { Button, Card } from "react-bootstrap";
import { formatBandwidth, formatCost } from "../modules/format";
import { RouterImage } from "./RouterImage";

interface Props {
  name: string;
  image_url: string;
  bandwidth_mbps: number;
  cost_rub: number;
  likes_count: number;
  canDelete: boolean; // свой маршрутизатор создателя (is_own = 1)
  onDelete: () => void;
  onClick: () => void; // переход в ленту, начиная с этой карточки
}

// Карточка плитки: изображение, название, два поля по теме и количество лайков.
// У своих карточек создателя есть кнопка «Удалить».
export const ProviderRouterTile: FC<Props> = ({
  name,
  image_url,
  bandwidth_mbps,
  cost_rub,
  likes_count,
  canDelete,
  onDelete,
  onClick,
}) => {
  const handleDelete = (event: MouseEvent) => {
    event.stopPropagation(); // не открывать ленту по нажатию на кнопку
    onDelete();
  };

  return (
    <Card className="provider_router_tile" onClick={onClick} role="button">
      <RouterImage className="tile-image" src={image_url} alt={name} />
      <Card.Body className="tile-body">
        <Card.Title as="h2">{name}</Card.Title>
        <div className="tile-chips">
          <span className="chip">{formatBandwidth(bandwidth_mbps)}</span>
          <span className="chip">{formatCost(cost_rub)}</span>
        </div>
        <div className="tile-footer">
          <Card.Text className="tile-likes">♥ {likes_count}</Card.Text>
          {canDelete && (
            <Button size="sm" variant="outline-danger" className="tile-delete" onClick={handleDelete}>
              Удалить
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};
