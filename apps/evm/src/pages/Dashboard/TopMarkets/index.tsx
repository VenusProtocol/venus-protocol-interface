import { cn } from '@venusprotocol/ui';

import { useGetPool } from 'clients/api';
import { AssetCard, type AssetCardProps } from 'components';
import { useChain } from 'hooks/useChain';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import { compareBigNumbers, getCombinedDistributionApys } from 'utilities';
import { TypeButton } from './TypeButton';

export const TopMarkets: React.FC = () => {
  const { Trans } = useTranslation();

  const { corePoolComptrollerContractAddress } = useChain();

  const [type, setType] = useState<AssetCardProps['type']>('supply');

  // TODO: update to fetch top markets across chains
  const { data: getPoolData } = useGetPool({
    poolComptrollerAddress: corePoolComptrollerContractAddress,
  });
  const poolAssets = getPoolData?.pool.assets ?? [];

  const topAssets = [...poolAssets]
    // Filter out non-borrowable assets if we're displaying the top borrow markets
    .filter(
      asset =>
        type !== 'borrow' || (asset.isBorrowable && !asset.disabledTokenActions.includes('borrow')),
    )
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
    <div className="space-y-3 xl:border xl:border-dark-blue-hover xl:rounded-lg xl:p-6 xl:space-y-6">
      <div className="flex items-baseline font-semibold">
        <Trans
          i18nKey="dashboard.topMarkets.title"
          components={{
            SupplyButton: (
              <TypeButton isActive={type === 'supply'} onClick={() => setType('supply')} />
            ),
            BorrowButton: (
              <TypeButton isActive={type === 'borrow'} onClick={() => setType('borrow')} />
            ),
          }}
        />
      </div>

      <div className="flex items-center gap-x-3 xl:flex-col xl:gap-y-2 xl:-mx-4 xl:-mb-4">
        {topAssets.map((asset, index) => (
          <AssetCard
            key={`${asset.vToken.chainId}-${asset.vToken.address}`}
            type={type}
            asset={asset}
            poolComptrollerContractAddress={corePoolComptrollerContractAddress}
            className={cn(
              'xl:border-0',
              index > 0 && 'hidden md:flex',
              index > 1 && 'md:hidden lg:flex',
            )}
          />
        ))}
      </div>
    </div>
  );
};
