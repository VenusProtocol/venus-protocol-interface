import s from './Cell.module.css';

export interface ICellProps {
  label: string;
  value: string | number;
}

const Cell: React.FC<ICellProps> = ({ label, value }) => (
  <div className={s.root}>
    <p className={s.label}>{label}</p>

    <p className={s.value}>{value}</p>
  </div>
);

export default Cell;
