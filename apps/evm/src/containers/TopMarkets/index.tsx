import { Spinner, cn } from '@venusprotocol/ui';

import { useGetPool } from 'clients/api';
import { ButtonGroup, Icon } from 'components';
import { AssetCard, type AssetCardProps } from 'containers/AssetCard';
import { useChain } from 'hooks/useChain';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useState } from 'react';
import { compareBigNumbers, getCombinedDistributionApys } from 'utilities';
import { TypeButton } from './TypeButton';

export interface TopMarketProps {
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const TopMarkets: React.FC<TopMarketProps> = ({ className, variant = 'primary' }) => {
  const { Trans, t } = useTranslation();

  const { corePoolComptrollerContractAddress } = useChain();

  const [type, setType] = useState<AssetCardProps['type']>('supply');

  // TODO: update to fetch top markets across chains
  const { accountAddress } = useAccountAddress();
  const { data: getPoolData } = useGetPool({
    poolComptrollerAddress: corePoolComptrollerContractAddress,
    accountAddress,
  });
  const poolAssets = getPoolData?.pool.assets ?? [];

  const topAssets = [...poolAssets]
    // Filter out non-borrowable assets if we're displaying the top borrow markets
    .filter(
      asset =>
        type !== 'borrow' ||
        (asset.isBorrowableByUser && !asset.disabledTokenActions.includes('borrow')),
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
    <div
      className={cn(
        'space-y-3',
        variant === 'primary' &&
          'xl:border xl:border-dark-blue-hover xl:rounded-lg xl:p-6 xl:space-y-6',
        className,
      )}
    >
      <div className={cn('flex items-center gap-x-2', variant === 'primary' && 'xl:hidden')}>
        <Icon name="crown" className="text-yellow shrink-0" />

        <span className="font-semibold flex grow">
          <Trans
            i18nKey="dashboard.topMarkets.interactiveTitle"
            components={{
              SupplyButton: (
                <TypeButton isActive={type === 'supply'} onClick={() => setType('supply')} />
              ),
              BorrowButton: (
                <TypeButton isActive={type === 'borrow'} onClick={() => setType('borrow')} />
              ),
              Group: <div className="flex items-center gap-x-2" />,
            }}
          />
        </span>
      </div>

      {variant === 'primary' && (
        <div className="space-y-6 hidden xl:block">
          <div className="flex items-center gap-x-2">
            <Icon name="crown" className="text-yellow shrink-0" />

            <p className="font-semibold grow">{t('dashboard.topMarkets.textTitle')}</p>
          </div>

          <ButtonGroup
            buttonLabels={[
              t('dashboard.topMarkets.supplyButton.label'),
              t('dashboard.topMarkets.borrowButton.label'),
            ]}
            onButtonClick={index => setType(index === 0 ? 'supply' : 'borrow')}
            activeButtonIndex={type === 'supply' ? 0 : 1}
            fullWidth
          />
        </div>
      )}

      <div
        className={cn(
          'flex items-center gap-x-3',
          variant === 'primary' && 'xl:flex-col xl:gap-y-2 xl:-mx-4 xl:-mb-4',
        )}
      >
        {topAssets.length > 0 ? (
          topAssets.map((asset, index) => (
            <AssetCard
              key={`${asset.vToken.chainId}-${asset.vToken.address}`}
              type={type}
              asset={asset}
              poolComptrollerContractAddress={corePoolComptrollerContractAddress}
              className={cn(
                variant === 'primary' && 'xl:border-0',
                index > 0 && 'hidden md:flex',
                index > 1 && 'md:hidden lg:flex',
              )}
            />
          ))
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};
