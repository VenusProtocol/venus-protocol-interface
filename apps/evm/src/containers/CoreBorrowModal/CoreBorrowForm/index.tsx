import { Tabs } from 'components';
import AssetAccessor from 'containers/AssetAccessor';
import BorrowForm from 'containers/MarketForm/BorrowForm';
import RepayWithWalletBalanceForm from 'containers/MarketForm/Repay/RepayWithWalletBalanceForm';
import SupplyForm from 'containers/MarketForm/SupplyForm';
import WithdrawForm from 'containers/MarketForm/WithdrawForm';
import { useChain } from 'hooks/useChain';
import type { Tab } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import type { Asset } from 'types';
import { CollateralSelect } from './CollateralSelect';

export interface CoreBorrowFormProps {
  asset: Asset;
  collaterals: Asset[];
  preselectedCollateral?: Asset;
  onSubmitSuccess: () => void;
}

export const CoreBorrowForm: React.FC<CoreBorrowFormProps> = ({
  asset,
  collaterals,
  preselectedCollateral,
  onSubmitSuccess,
}) => {
  const { t } = useTranslation();
  const { corePoolComptrollerContractAddress } = useChain();
  const [collateral, setCollateral] = useState(preselectedCollateral ?? collaterals[0]);

  const collateralSelect = collateral && (
    <CollateralSelect collaterals={collaterals} value={collateral} onChange={setCollateral} />
  );

  const collateralTabs: Tab[] = collateral
    ? [
        {
          id: 'supply',
          title: t('spokeForm.supply.tabTitle'),
          content: (
            <AssetAccessor
              vToken={collateral.vToken}
              poolComptrollerAddress={corePoolComptrollerContractAddress}
              action="supply"
            >
              {({ asset: collateralAsset, pool }) => (
                <SupplyForm
                  key={collateralAsset.vToken.address}
                  asset={collateralAsset}
                  pool={pool}
                  collateralSelectorSlot={collateralSelect}
                  disableIntegratedSwap
                  onSubmitSuccess={onSubmitSuccess}
                />
              )}
            </AssetAccessor>
          ),
        },
        {
          id: 'withdraw',
          title: t('spokeForm.withdraw.tabTitle'),
          content: (
            <AssetAccessor
              vToken={collateral.vToken}
              poolComptrollerAddress={corePoolComptrollerContractAddress}
              action="withdraw"
            >
              {({ asset: collateralAsset, pool }) => (
                <WithdrawForm
                  key={collateralAsset.vToken.address}
                  asset={collateralAsset}
                  pool={pool}
                  collateralSelectorSlot={collateralSelect}
                  onSubmitSuccess={onSubmitSuccess}
                />
              )}
            </AssetAccessor>
          ),
        },
      ]
    : [];

  const loanTabs: Tab[] = [
    {
      id: 'borrow',
      title: t('spokeForm.borrow.tabTitle'),
      content: (
        <AssetAccessor
          vToken={asset.vToken}
          poolComptrollerAddress={corePoolComptrollerContractAddress}
          action="borrow"
        >
          {({ asset: loanAsset, pool }) => (
            <BorrowForm
              asset={loanAsset}
              pool={pool}
              hideEModeBanner
              onSubmitSuccess={onSubmitSuccess}
            />
          )}
        </AssetAccessor>
      ),
    },
    {
      id: 'repay',
      title: t('spokeForm.repay.tabTitle'),
      content: (
        <AssetAccessor
          vToken={asset.vToken}
          poolComptrollerAddress={corePoolComptrollerContractAddress}
          action="repay"
        >
          {({ asset: loanAsset, pool }) => (
            <RepayWithWalletBalanceForm
              asset={loanAsset}
              pool={pool}
              disableIntegratedSwap
              onSubmitSuccess={onSubmitSuccess}
            />
          )}
        </AssetAccessor>
      ),
    },
  ];

  const loanTabsDom = <Tabs tabs={loanTabs} variant="primary" />;

  if (collateralTabs.length === 0) {
    return loanTabsDom;
  }

  return (
    <Tabs
      variant="secondary"
      initialActiveTabId={preselectedCollateral ? 'collateral' : 'loan'}
      tabs={[
        {
          id: 'collateral',
          title: t('spokeForm.collateralTabTitle'),
          content: <Tabs tabs={collateralTabs} variant="primary" />,
        },
        { id: 'loan', title: t('spokeForm.loanTabTitle'), content: loanTabsDom },
      ]}
    />
  );
};
