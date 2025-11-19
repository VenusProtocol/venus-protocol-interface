import { Tabs } from 'components';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import type { Tab } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';
import type { Asset, Pool } from 'types';
import NativeTokenBalanceWrapper from '../NativeTokenBalanceWrapper';
import { RepayWithCollateralForm } from './RepayWithCollateralForm';
import RepayWithWalletBalanceForm from './RepayWithWalletBalanceForm';

export interface RepayProps {
  asset: Asset;
  pool: Pool;
}

export const Repay: React.FC<RepayProps> = ({ asset, pool }) => {
  const { t } = useTranslation();

  const isRepayWithCollateralFeatureEnabled = useIsFeatureEnabled({
    name: 'repayWithCollateral',
  });

  const repayWithWalletBalanceFormDom = (
    <NativeTokenBalanceWrapper asset={asset} pool={pool}>
      {({ asset, pool, userTokenWrappedBalanceMantissa }) => (
        <RepayWithWalletBalanceForm
          asset={asset}
          pool={pool}
          userTokenWrappedBalanceMantissa={userTokenWrappedBalanceMantissa}
        />
      )}
    </NativeTokenBalanceWrapper>
  );

  if (!isRepayWithCollateralFeatureEnabled) {
    return repayWithWalletBalanceFormDom;
  }

  const tabs: Tab[] = [
    {
      id: 'repayWithWalletBalance',
      title: t('operationForm.repayTab.walletBalanceTabTitle'),
      content: repayWithWalletBalanceFormDom,
    },
    {
      id: 'repayWithCollateral',
      title: t('operationForm.repayTab.collateralTabTitle'),
      content: <RepayWithCollateralForm />,
    },
  ];

  return <Tabs tabs={tabs} className="space-y-4" />;
};
