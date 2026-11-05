import { Tabs } from 'components';
import AssetAccessor from 'containers/AssetAccessor';
import DisabledActionNotice from 'containers/AssetAccessor/DisabledActionNotice';
import BorrowForm from 'containers/MarketForm/BorrowForm';
import RepayWithWalletBalanceForm from 'containers/MarketForm/Repay/RepayWithWalletBalanceForm';
import SupplyForm from 'containers/MarketForm/SupplyForm';
import WithdrawForm from 'containers/MarketForm/WithdrawForm';
import { useChain } from 'hooks/useChain';
import type { Tab } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import type { Asset } from 'types';
import { areTokensEqual } from 'utilities';
import { CollateralSelect } from './CollateralSelect';
import { getInitialCollateral } from './getInitialCollateral';
import { useCollateralOptions } from './useCollateralOptions';

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
  const { options, getDefaultOption } = useCollateralOptions({ collaterals });
  const initialCollateral = getInitialCollateral({ collaterals, preselectedCollateral });
  const [option, setOption] = useState(initialCollateral && getDefaultOption(initialCollateral));
  const collateral = option?.asset;

  const supplyCollateralSelect = option && (
    <CollateralSelect options={options} value={option} onChange={setOption} />
  );

  const withdrawCollateralSelect = option && (
    <CollateralSelect
      options={options.filter(item =>
        areTokensEqual(item.token, item.asset.vToken.underlyingToken),
      )}
      value={{ asset: option.asset, token: option.asset.vToken.underlyingToken }}
      onChange={setOption}
    />
  );

  const collateralTabs: Tab[] = collateral
    ? [
        {
          id: 'supply',
          title: t('spokeForm.supply.tabTitle'),
          content: collateral.disabledTokenActions.includes('supply') ? (
            <div className="flex min-h-96 flex-col gap-y-4">
              <div>{supplyCollateralSelect}</div>
              <DisabledActionNotice token={collateral.vToken.underlyingToken} action="supply" />
            </div>
          ) : (
            <AssetAccessor
              vToken={collateral.vToken}
              poolComptrollerAddress={corePoolComptrollerContractAddress}
              action="supply"
            >
              {({ asset: collateralAsset, pool }) => (
                <SupplyForm
                  key={`${collateralAsset.vToken.address}-${option.token.address}`}
                  asset={collateralAsset}
                  pool={pool}
                  fromToken={option.token}
                  collateralSelectorSlot={supplyCollateralSelect}
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
          content: collateral.disabledTokenActions.includes('withdraw') ? (
            <div className="flex min-h-96 flex-col gap-y-4">
              <div>{withdrawCollateralSelect}</div>
              <DisabledActionNotice token={collateral.vToken.underlyingToken} action="withdraw" />
            </div>
          ) : (
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
                  collateralSelectorSlot={withdrawCollateralSelect}
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
