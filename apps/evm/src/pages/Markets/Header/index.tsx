import { cn } from '@venusprotocol/ui';
import { PageStatHeader } from 'components';
import { TopMarkets } from 'containers/TopMarkets';
import { useChain } from 'hooks/useChain';
import { usePoolStats } from 'hooks/usePoolStats';
import { useTranslation } from 'libs/translations';
import type { Pool } from 'types';
import { areAddressesEqual } from 'utilities';

export interface HeaderProps {
  pool: Pool;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ pool, className }) => {
  const { t } = useTranslation();

  const { corePoolComptrollerContractAddress } = useChain();
  const isCorePool = areAddressesEqual(pool.comptrollerAddress, corePoolComptrollerContractAddress);

  const cells = usePoolStats({
    pools: [pool],
    stats: ['supply', 'borrow', 'liquidity', 'assetCount'],
  });

  const title = isCorePool ? t('markets.header.venusCore.title') : pool.name;
  const description = isCorePool ? t('markets.header.venusCore.description') : undefined;

  return (
    <div className={cn('space-y-6 sm:space-y-12 2xl:space-y-10', className)}>
      <PageStatHeader title={title} description={description} cells={cells} />

      <TopMarkets variant="secondary" className="mb-3" />
    </div>
  );
};
