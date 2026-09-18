import { Button, cn } from '@venusprotocol/ui';

import { HealthFactorPill } from 'components';

export interface PoolPill {
  id: string;
  name: string;
  healthFactor?: number;
}

export interface PoolPillsProps {
  pools: PoolPill[];
  selectedPoolId: string;
  onChange: (poolId: string) => void;
  className?: string;
}

export const PoolPills: React.FC<PoolPillsProps> = ({
  pools,
  selectedPoolId,
  onChange,
  className,
}) => (
  <div className={cn('flex flex-wrap gap-2', className)}>
    {pools.map(pool => (
      <Button
        key={`dashboard-pool-pill-${pool.id}`}
        variant="quaternary"
        size="sm"
        rounded
        active={pool.id === selectedPoolId}
        onClick={() => onChange(pool.id)}
      >
        <span className="flex items-center gap-x-2">
          {pool.name}

          {pool.healthFactor !== undefined && <HealthFactorPill factor={pool.healthFactor} />}
        </span>
      </Button>
    ))}
  </div>
);
