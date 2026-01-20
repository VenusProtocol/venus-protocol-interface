import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';
import { useGetPool } from 'clients/api';
import { ButtonGroup } from 'components';
import { useChain } from 'hooks/useChain';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { useState } from 'react';
import type { Token } from 'types';
import { getCombinedDistributionApys } from 'utilities';
import { Borrow } from './Borrow';
import { Supply } from './Supply';

const cardClassName = cn(
  'flex items-center justify-between p-3',
  'rounded-lg bg-[rgba(24,29,42,0.1)] shadow-[0_-1px_1px_0_#21293A_inset,0_1px_1px_0_rgba(255,255,255,0.25)_inset] backdrop-blur-xs',
);

export const HeroTabs: React.FC = () => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<'supply' | 'borrow'>('supply');

  const tabs = [
    {
      title: t('landing.hero.supply'),
      id: 'supply',
    },
    {
      title: t('landing.hero.borrow'),
      id: 'borrow',
    },
  ] as const;

  const { chainId } = useChainId();
  const { corePoolComptrollerContractAddress } = useChain();

  // TODO: update to fetch top markets across chains
  const { accountAddress } = useAccountAddress();

  const { data: getPoolData } = useGetPool({
    poolComptrollerAddress: corePoolComptrollerContractAddress,
    accountAddress,
  });
  const poolAssets = getPoolData?.pool.assets ?? [];

  let token: (Token & { chainId: number }) | undefined = undefined;
  let apy = activeTab === 'supply' ? new BigNumber(0) : new BigNumber('Infinity');

  [...poolAssets]
    // Filter out non-borrowable assets if we're displaying the top borrow markets
    .filter(
      asset =>
        activeTab !== 'borrow' ||
        (asset.isBorrowable && !asset.disabledTokenActions.includes('borrow')),
    )
    .forEach(asset => {
      if (activeTab === 'supply') {
        const assetSupplyApy = asset.supplyApyPercentage.plus(
          getCombinedDistributionApys({ asset }).totalSupplyApyBoostPercentage,
        );
        if (assetSupplyApy.gt(apy)) {
          token = { ...asset.vToken.underlyingToken, chainId };
          apy = assetSupplyApy;
        }
        apy = BigNumber.max(apy, assetSupplyApy);
      } else {
        const assetBorrowApy = asset.borrowApyPercentage.minus(
          getCombinedDistributionApys({ asset }).totalBorrowApyBoostPercentage,
        );
        if (assetBorrowApy.lt(apy)) {
          token = { ...asset.vToken.underlyingToken, chainId };
          apy = assetBorrowApy;
        }
      }
    });

  const handleChange = (index: number) => {
    const id = tabs[index].id;
    setActiveTab(id);
  };

  return (
    <div className={cn('flex flex-col w-full gap-3 sm:max-w-135.75')}>
      <div className={cardClassName}>
        <ButtonGroup
          buttonLabels={tabs.map(({ title }) => title)}
          activeButtonIndex={tabs.findIndex(tab => activeTab === tab.id)}
          onButtonClick={handleChange}
          fullWidth
          className="bg-dark-blue-active gap-x-0 rounded-lg"
          buttonClassName="h-12 m-0!"
          // activeClassName="bg-blue hover:bg-blue-hover!"
        />
      </div>

      <div className={cn(cardClassName, 'p-3 sm:p-6')}>
        {token &&
          apy &&
          (activeTab === 'supply' ? (
            <Supply token={token} apy={apy} />
          ) : (
            <Borrow token={token} apy={apy} />
          ))}
      </div>
    </div>
  );
};
