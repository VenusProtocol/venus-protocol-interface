import type BigNumber from 'bignumber.js';
import { Card, CellGroup, cn } from 'components';
import type { Pool, Vault } from 'types';

import Section from '../Section';
import { useExtractData } from '../useExtractData';

export interface PoolSummaryProps {
  pools: Pool[];
  variant?: 'primary' | 'secondary';
  vaults?: Vault[];
  title?: string;
  xvsPriceCents?: BigNumber;
  vaiPriceCents?: BigNumber;
  displayHealthFactor?: boolean;
  displayAccountHealth?: boolean;
  className?: string;
}

export const PoolSummary: React.FC<PoolSummaryProps> = ({
  pools,
  variant = 'primary',
  vaults,
  title,
  displayHealthFactor = false,
  displayAccountHealth = false,
  xvsPriceCents,
  vaiPriceCents,
  className,
}) => {
  const { cells } = useExtractData({
    pools,
    vaults,
    xvsPriceCents,
    vaiPriceCents,
    includeHealthFactor: displayHealthFactor,
    includeAccountHealth: displayAccountHealth,
  });

  return (
    <Section className={className} title={title}>
      <CellGroup
        small={variant === 'secondary'}
        cells={cells}
        className={cn(displayAccountHealth && 'xl:hidden')}
      />

      {/* XL view when displaying account health */}
      <Card className={cn('hidden justify-between', displayAccountHealth && 'xl:flex')}>
        <CellGroup
          small={variant === 'secondary'}
          cells={cells.slice(0, cells.length - 1)}
          className="w-full xl:p-0"
        />

        {/* Account health */}
        <div className="shrink-0">{cells[cells.length - 1].value}</div>
      </Card>
    </Section>
  );
};
