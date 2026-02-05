import { PoolStats } from 'containers/PoolStats';
import { TopMarkets } from 'containers/TopMarkets';
import { useChain } from 'hooks/useChain';
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

  const title = isCorePool ? t('markets.header.venusCore.title') : pool.name;
  const description = isCorePool ? t('markets.header.venusCore.description') : undefined;

  return (
    <div className={className}>
      <div className="space-y-6 mb-6 sm:mb-12 xl:flex xl:space-y-0 xl:gap-x-6 xl:justify-between xl:items-center 2xl:mb-10">
        <div>
          <h1 className="text-p1s sm:text-h6">{title}</h1>
          <p className="text-1br">{description}</p>
        </div>

        <PoolStats
          pools={[pool]}
          variant="secondary"
          className="xl:w-auto"
          stats={['supply', 'borrow', 'liquidity', 'assetCount']}
        />
      </div>

      <TopMarkets variant="secondary" className="mb-3" />
    </div>
  );
};
