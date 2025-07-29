import type BigNumber from 'bignumber.js';
import { AccountHealthBar, Card, CellGroup } from 'components';
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
  const { totalBorrowCents, borrowLimitCents, cells } = useExtractData({
    pools,
    vaults,
    xvsPriceCents,
    vaiPriceCents,
    includeHealthFactor: displayHealthFactor,
  });

  return (
    <Section className={className} title={title}>
      <Card className="bg-transparent p-0 space-y-2 sm:p-0 xl:space-y-0 xl:bg-cards xl:flex xl:justify-between">
        <CellGroup small={variant === 'secondary'} cells={cells} className="p-0" />

        {displayAccountHealth && (
          <AccountHealthBar
            className="bg-cards block w-full rounded-xl p-4 sm:p-4 xl:w-auto xl:p-6 xl:flex-1 xl:max-w-100"
            borrowBalanceCents={totalBorrowCents.toNumber()}
            borrowLimitCents={borrowLimitCents.toNumber()}
          />
        )}
      </Card>
    </Section>
  );
};
