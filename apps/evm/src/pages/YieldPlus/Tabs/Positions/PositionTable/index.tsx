import type { YieldPlusPosition } from 'types';

export interface PositionTableProps {
  positions: YieldPlusPosition[];
}

export const PositionTable: React.FC<PositionTableProps> = ({ positions }) => {
  console.log(positions);
};
