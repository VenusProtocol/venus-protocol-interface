import type { Pool } from 'types';

import { Summary } from './Summary';
import Tables from './Tables';

export interface PositionsProps {
  pools: Pool[];
  className?: string;
}

export const Positions: React.FC<PositionsProps> = ({ pools, className }) => {
  const selectedPool = pools.find(pool => pool.name === 'Core Pool') || pools[0];

  const hasBorrowBalance = selectedPool?.userBorrowBalanceCents?.isGreaterThan(0);

  return (
    <div className={className}>
      <Summary
        pool={selectedPool}
        displayHealthFactor={hasBorrowBalance}
        displayAccountHealth={hasBorrowBalance}
        className="mb-10 md:mb-6"
      />

      <Tables pool={selectedPool} />
    </div>
  );
};
