import { SecondaryButton, cn } from '@venusprotocol/ui';

import { Select } from 'components';
import { useTranslation } from 'libs/translations';
import { PositionHealthIndicator } from '../../PositionHealthIndicator';

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
}) => {
  const { t } = useTranslation();

  const renderLabel = ({ pool, showHealth }: { pool: PoolPill; showHealth: boolean }) => (
    <span className="inline-flex items-center gap-3">
      {pool.name}

      {showHealth && pool.healthFactor !== undefined && (
        <PositionHealthIndicator factor={pool.healthFactor} />
      )}
    </span>
  );

  return (
    <div className={className}>
      <Select
        className="sm:hidden"
        value={selectedPoolId}
        onChange={value => onChange(String(value))}
        options={pools.map(pool => ({
          value: pool.id,
          label: ({ isRenderedInButton }) =>
            renderLabel({ pool, showHealth: !isRenderedInButton && pool.id !== selectedPoolId }),
        }))}
        menuTitle={t('account.positions.label')}
      />

      <div
        role="group"
        aria-label={t('account.positions.label')}
        className="hidden flex-wrap gap-3 sm:flex lg:justify-end"
      >
        {pools.map(pool => {
          const isActive = pool.id === selectedPoolId;

          return (
            <SecondaryButton
              key={`dashboard-pool-pill-${pool.id}`}
              active={isActive}
              aria-pressed={isActive}
              onClick={() => onChange(pool.id)}
              className={cn(
                'h-auto min-h-12 rounded-lg p-3 text-sm',
                isActive
                  ? 'border-transparent font-semibold text-primary hover:border-transparent'
                  : 'font-normal text-secondary shadow-none! hover:text-primary',
              )}
            >
              {renderLabel({ pool, showHealth: !isActive })}
            </SecondaryButton>
          );
        })}
      </div>
    </div>
  );
};
