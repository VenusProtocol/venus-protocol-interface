import { cn } from '@venusprotocol/ui';

import { type ColumnKey, MarketTable } from 'containers/MarketTable';
import { useMarketsPagePath } from 'hooks/useMarketsPagePath';
import { useTranslation } from 'libs/translations';
import type { Pool } from 'types';
import { compareBigNumbers, getCombinedDistributionApys } from 'utilities';
import { Placeholder } from '../../../Placeholder';
import { RecommendationCarousel } from './RecommendationCarousel';

export interface TabContentProps {
  type: 'supply' | 'borrow';
  pool: Pool;
}

export const TabContent: React.FC<TabContentProps> = ({ type, pool }) => {
  const { t } = useTranslation();
  const { marketsPagePath } = useMarketsPagePath();

  const assets = pool.assets.filter(asset =>
    type === 'supply'
      ? asset.userSupplyBalanceTokens.isGreaterThan(0) || asset.isCollateralOfUser
      : asset.userBorrowBalanceTokens.isGreaterThan(0),
  );

  const columns: ColumnKey[] =
    type === 'supply'
      ? ['asset', 'supplyApy', 'userSupplyBalance', 'collateral']
      : ['asset', 'borrowApy', 'userBorrowBalance', 'userBorrowLimitSharePercentage'];

  const recommendedAssets = [...pool.assets]
    .filter(asset => {
      if (type === 'supply') {
        return (
          asset.userWalletBalanceTokens.isGreaterThan(0) &&
          !asset.disabledTokenActions.includes('supply')
        );
      }

      return (
        pool.userBorrowLimitCents?.isGreaterThan(0) &&
        asset.isBorrowableByUser &&
        !asset.disabledTokenActions.includes('borrow')
      );
    })
    .sort((assetA, assetB) => {
      if (type === 'supply') {
        const assetASupplyApy = assetA.supplyApyPercentage.plus(
          getCombinedDistributionApys({ asset: assetA }).totalSupplyApyBoostPercentage,
        );
        const assetBSupplyApy = assetB.supplyApyPercentage.plus(
          getCombinedDistributionApys({ asset: assetB }).totalSupplyApyBoostPercentage,
        );

        return compareBigNumbers(assetASupplyApy, assetBSupplyApy, 'desc');
      }

      const assetABorrowApy = assetA.borrowApyPercentage.minus(
        getCombinedDistributionApys({ asset: assetA }).totalBorrowApyBoostPercentage,
      );
      const assetBBorrowApy = assetB.borrowApyPercentage.minus(
        getCombinedDistributionApys({ asset: assetB }).totalBorrowApyBoostPercentage,
      );

      return compareBigNumbers(assetABorrowApy, assetBBorrowApy, 'asc');
    })
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-y-3 sm:gap-y-6">
      {assets.length > 0 ? (
        <MarketTable
          assets={assets}
          poolName={pool.name}
          poolComptrollerContractAddress={pool.comptrollerAddress}
          userEModeGroup={pool.userEModeGroup}
          marketType={type}
          initialOrder={{
            orderBy: 'userSupplyBalance',
            orderDirection: 'desc',
          }}
          columns={columns}
          breakpoint="sm"
          controls={false}
        />
      ) : (
        <Placeholder
          className="order-2"
          iconName="graphOutline"
          to={marketsPagePath}
          title={
            type === 'supply'
              ? t('dashboard.pools.supplyTab.placeholder.title')
              : t('dashboard.pools.borrowTab.placeholder.title')
          }
        />
      )}

      {recommendedAssets.length > 0 && (
        <RecommendationCarousel
          className={cn(assets.length === 0 && 'order-1')}
          poolComptrollerContractAddress={pool.comptrollerAddress}
          assets={recommendedAssets}
          type={type}
        />
      )}
    </div>
  );
};
