import { NoticeWarning, Tabs } from 'components';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import type { Tab } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';
import type { Asset, Pool } from 'types';
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

  const displayTabs =
    isRepayWithCollateralFeatureEnabled &&
    !asset.disabledTokenActions.includes('repayWithCollateral');

  const repayWithWalletBalanceFormDom = <RepayWithWalletBalanceForm asset={asset} pool={pool} />;

  if (!displayTabs) {
    return repayWithWalletBalanceFormDom;
  }

  const hasCollateral = pool.userBorrowLimitCents?.isGreaterThan(0);

  const tabs: Tab[] = [
    {
      id: 'repayWithWalletBalance',
      title: t('operationForm.repayTab.walletBalanceTabTitle'),
      content: repayWithWalletBalanceFormDom,
    },
    {
      id: 'repayWithCollateral',
      title: t('operationForm.repayTab.collateralTabTitle'),
      content: hasCollateral ? (
        <RepayWithCollateralForm pool={pool} asset={asset} />
      ) : (
        <NoticeWarning description={t('operationForm.repayTab.noCollateralWarning')} />
      ),
    },
  ];

  return <Tabs tabs={tabs} className="space-y-4" />;
};
