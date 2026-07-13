import { Cell, type CellProps } from 'components';

export interface GridCellGroupProps {
  cells: CellProps[];
}

export const GridCellGroup: React.FC<GridCellGroupProps> = ({ cells }) => (
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
    {cells.map(cell => (
      <Cell {...cell} key={cell.label} />
    ))}
  </div>
);
