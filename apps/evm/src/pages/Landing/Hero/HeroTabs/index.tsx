import { cn } from '@venusprotocol/ui';

import { useGetPool } from 'clients/api';
import { ButtonGroup } from 'components';
import { useChain } from 'hooks/useChain';
import { type Tab, useTabs } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Asset } from 'types';
import { getCombinedDistributionApys } from 'utilities';
import { GlassCard } from './GlassCard';
import { TabContent } from './TabContent';

export const HeroTabs: React.FC = () => {
  const { t } = useTranslation();

  const { corePoolComptrollerContractAddress } = useChain();

  // TODO: update to fetch top markets across chains
  const { accountAddress } = useAccountAddress();

  const { data: getPoolData } = useGetPool({
    poolComptrollerAddress: corePoolComptrollerContractAddress,
    accountAddress,
  });
  const poolAssets = getPoolData?.pool.assets ?? [];

  let topSupplyAsset: Asset | undefined;
  let topSupplyAssetApys: ReturnType<typeof getCombinedDistributionApys> | undefined;

  let topBorrowAsset: Asset | undefined;
  let topBorrowAssetApys: ReturnType<typeof getCombinedDistributionApys> | undefined;

  poolAssets.forEach(asset => {
    const assetApys = getCombinedDistributionApys({ asset });

    if (
      !asset.disabledTokenActions.includes('supply') &&
      assetApys.totalSupplyApyPercentage.isGreaterThan(
        topSupplyAssetApys?.totalSupplyApyPercentage || Number.NEGATIVE_INFINITY,
      )
    ) {
      topSupplyAsset = asset;
      topSupplyAssetApys = assetApys;
    }

    if (
      asset.isBorrowable &&
      !asset.disabledTokenActions.includes('borrow') &&
      assetApys.totalBorrowApyPercentage.isLessThan(
        topBorrowAssetApys?.totalBorrowApyPercentage || Number.POSITIVE_INFINITY,
      )
    ) {
      topBorrowAsset = asset;
      topBorrowAssetApys = assetApys;
    }
  });

  const tabs: Tab[] = [
    {
      title: t('landing.hero.supply'),
      id: 'supply',
      content: topSupplyAsset && (
        <TabContent
          poolComptrollerContractAddress={corePoolComptrollerContractAddress}
          asset={topSupplyAsset}
          type="supply"
        />
      ),
    },
    {
      title: t('landing.hero.borrow'),
      id: 'borrow',
      content: topBorrowAsset && (
        <TabContent
          poolComptrollerContractAddress={corePoolComptrollerContractAddress}
          asset={topBorrowAsset}
          type="borrow"
        />
      ),
    },
  ];

  const { activeTab, setActiveTab } = useTabs({
    tabs,
  });

  return (
    <div className={cn('flex flex-col w-full gap-3 sm:max-w-135.75')}>
      <GlassCard>
        <ButtonGroup
          buttonLabels={tabs.map(({ title }) => title)}
          activeButtonIndex={tabs.findIndex(tab => activeTab.id === tab.id)}
          onButtonClick={index => setActiveTab(tabs[index])}
          fullWidth
          buttonSize="md"
        />
      </GlassCard>

      <GlassCard className="sm:p-6">{activeTab.content}</GlassCard>
    </div>
  );
};
