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
  onSubmitSuccess?: () => void;
}

export const Repay: React.FC<RepayProps> = ({ asset, pool, onSubmitSuccess }) => {
  const { t } = useTranslation();

  const isRepayWithCollateralFeatureEnabled = useIsFeatureEnabled({
    name: 'repayWithCollateral',
  });

  const displayTabs =
    isRepayWithCollateralFeatureEnabled &&
    !asset.disabledTokenActions.includes('repayWithCollateral');

  const repayWithWalletBalanceFormDom = (
    <RepayWithWalletBalanceForm asset={asset} pool={pool} onSubmitSuccess={onSubmitSuccess} />
  );

  if (!displayTabs) {
    return repayWithWalletBalanceFormDom;
  }

  const hasCollateral = pool.userBorrowLimitCents?.isGreaterThan(0);

  const tabs: Tab[] = [
    {
      id: 'repayWithWalletBalance',
      title: t('marketForm.repayTab.walletBalanceTabTitle'),
      content: repayWithWalletBalanceFormDom,
    },
    {
      id: 'repayWithCollateral',
      title: t('marketForm.repayTab.collateralTabTitle'),
      content: hasCollateral ? (
        <RepayWithCollateralForm pool={pool} asset={asset} onSubmitSuccess={onSubmitSuccess} />
      ) : (
        <NoticeWarning description={t('marketForm.repayTab.noCollateralWarning')} />
      ),
    },
  ];

  return <Tabs tabs={tabs} className="space-y-4" />;
};
