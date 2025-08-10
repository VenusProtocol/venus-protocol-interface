import type BigNumber from 'bignumber.js';
import { Card, Cell, CellGroup, cn } from 'components';
import type { Pool, Vault } from 'types';

import Section from '../Section';
import { useExtractData } from '../useExtractData';

export interface PoolSummaryProps {
  pools: Pool[];
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
      {/* XS view when displaying account health */}
      <div className={cn('space-y-2', displayAccountHealth ? 'sm:hidden' : 'hidden')}>
        <CellGroup cells={cells.slice(0, cells.length - 1)} variant="tertiary" />

        <Cell {...cells[cells.length - 1]} className="rounded-xl bg-cards p-4" />
      </div>

      <CellGroup
        cells={cells}
        className={cn(displayAccountHealth && 'hidden sm:grid xl:hidden')}
        variant="tertiary"
      />

      {/* XL view when displaying account health */}
      <Card className={cn('hidden justify-between', displayAccountHealth && 'xl:flex')}>
        <CellGroup
          cells={cells.slice(0, cells.length - 1)}
          className="w-full xl:p-0"
          variant="tertiary"
        />

        {/* Account health */}
        <div className="shrink-0">{cells[cells.length - 1].value}</div>
      </Card>
    </Section>
  );
};
