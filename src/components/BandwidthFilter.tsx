import { FC, FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { formatBandwidth } from "../modules/format";

interface Props {
  value: number; // выбранное на слайдере значение, Мбит/с
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void; // слайдер двигается — меняется только value
  onSubmit: () => void; // кнопка «Фильтровать» — применяем фильтр к списку
}

// Фильтр плитки по пропускной способности: слайдер и кнопка, как в ЛР1
export const BandwidthFilter: FC<Props> = ({
  value,
  min,
  max,
  step,
  onChange,
  onSubmit,
}) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <Form className="filter-form" onSubmit={handleSubmit}>
      <Form.Label htmlFor="bandwidth">
        Мин. пропускная способность: <output>{formatBandwidth(value)}</output>
      </Form.Label>
      <Form.Range
        id="bandwidth"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <Button className="action-button" type="submit">
        Фильтровать
      </Button>
    </Form>
  );
};
