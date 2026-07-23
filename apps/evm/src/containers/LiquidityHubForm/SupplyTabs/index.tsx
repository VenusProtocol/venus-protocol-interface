import { useGetPool } from 'clients/api';
import { Spinner, Tabs } from 'components';
import { useChain } from 'hooks/useChain';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import type { Tab } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { LiquidityHub } from 'types';
import { areTokensEqual } from 'utilities';
import { SupplyWithCollateralForm } from './SupplyWithCollateralForm';

export interface SupplyTabsProps {
  liquidityHub: LiquidityHub;
  onSubmitSuccess?: () => void;
}

export const SupplyTabs: React.FC<SupplyTabsProps> = ({ liquidityHub, onSubmitSuccess }) => {
  const { t } = useTranslation();

  const { accountAddress } = useAccountAddress();
  const { corePoolComptrollerContractAddress } = useChain();

  const { address: liquidityHubMigratorContractAddress } = useGetContractAddress({
    name: 'LiquidityHubMigrator',
  });

  const { data: getPools, isLoading } = useGetPool({
    poolComptrollerAddress: corePoolComptrollerContractAddress,
    accountAddress,
  });

  const corePool = getPools?.pool;

  const corePoolAsset = corePool?.assets.find(asset =>
    areTokensEqual(asset.vToken.underlyingToken, liquidityHub.vhToken.underlyingToken),
  );

  if (isLoading) {
    return <Spinner />;
  }

  // TODO: add content
  const walletTabDom = <></>;

  // Only render the "Supply with wallet balance" tab if there's no corresponding Core pool market
  // or the Liquidity Hub Migrator contract isn't supported on this chain
  if (!corePool || !corePoolAsset || !liquidityHubMigratorContractAddress) {
    return walletTabDom;
  }

  const tabs: Tab[] = [
    {
      id: 'wallet',
      title: t('liquidityHubForm.supplyTab.walletTabTitle'),
      content: walletTabDom,
    },
    {
      id: 'collateral',
      title: t('liquidityHubForm.supplyTab.collateralTabTitle'),
      content: (
        <SupplyWithCollateralForm
          liquidityHub={liquidityHub}
          onSubmitSuccess={onSubmitSuccess}
          liquidityHubMigratorContractAddress={liquidityHubMigratorContractAddress}
          corePool={corePool}
          corePoolAsset={corePoolAsset}
        />
      ),
    },
  ];

  return <Tabs tabs={tabs} />;
};
