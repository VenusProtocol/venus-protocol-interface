import { useState } from 'react';

import { Tabs } from 'components';
import { TAB_PARAM_KEY, type Tab, type TabNavType } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';
import { useSearchParams } from 'react-router';
import type { SpokeAsset, SpokePool } from 'types';
import { BorrowForm } from './BorrowForm';
import { RepayForm } from './RepayForm';
import { SupplyForm } from './SupplyForm';
import { WithdrawForm } from './WithdrawForm';

export type SpokeFormTabId = 'collateral' | 'loan';

export interface SpokeFormProps {
  spokePool: SpokePool;
  // Absent for a pool with no loan asset, where only the collateral side is offered
  asset?: SpokeAsset;
  initialActiveTabId?: SpokeFormTabId;
  initialCollateralTabId?: 'supply' | 'withdraw';
  initialLoanTabId?: 'borrow' | 'repay';
  preselectedCollateral?: SpokeAsset;
  onSubmitSuccess?: () => void;
  navType?: TabNavType;
}

export const SpokeForm: React.FC<SpokeFormProps> = ({
  spokePool,
  asset,
  initialActiveTabId = 'loan',
  initialCollateralTabId = 'supply',
  initialLoanTabId = 'borrow',
  preselectedCollateral,
  onSubmitSuccess,
  navType = 'state',
}) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [stateActiveTabId, setStateActiveTabId] = useState<SpokeFormTabId>(initialActiveTabId);

  const collaterals = spokePool.assets.filter(({ isBorrowable }) => !isBorrowable);
  const initialCollateral = preselectedCollateral ?? collaterals[0];

  const tabParamValue = searchParams.get(TAB_PARAM_KEY);
  const activeTabId =
    navType === 'searchParam' && (tabParamValue === 'collateral' || tabParamValue === 'loan')
      ? tabParamValue
      : stateActiveTabId;

  // The outer tab is owned here so the guided supply link can switch it, which the URL-driven
  // mode of useTabs would otherwise ignore
  const setActiveTabId = (newTabId: SpokeFormTabId) => {
    setStateActiveTabId(newTabId);

    if (navType === 'searchParam') {
      setSearchParams(
        currentSearchParams => {
          const newSearchParams = new URLSearchParams(currentSearchParams);
          newSearchParams.set(TAB_PARAM_KEY, newTabId);

          return newSearchParams;
        },
        { replace: true },
      );
    }
  };

  const collateralTabs: Tab[] = initialCollateral
    ? [
        {
          id: 'supply',
          title: t('spokeForm.supply.tabTitle'),
          content: (
            <SupplyForm
              spokePool={spokePool}
              collaterals={collaterals}
              initialCollateral={initialCollateral}
              onSubmitSuccess={onSubmitSuccess}
            />
          ),
        },
        {
          id: 'withdraw',
          title: t('spokeForm.withdraw.tabTitle'),
          content: (
            <WithdrawForm
              spokePool={spokePool}
              collaterals={collaterals}
              initialCollateral={initialCollateral}
              onSubmitSuccess={onSubmitSuccess}
            />
          ),
        },
      ]
    : [];

  const loanTabs: Tab[] = asset
    ? [
        {
          id: 'borrow',
          title: t('spokeForm.borrow.tabTitle'),
          content: (
            <BorrowForm
              spokePool={spokePool}
              asset={asset}
              onSupplyCollateralClick={() => setActiveTabId('collateral')}
              onSubmitSuccess={onSubmitSuccess}
            />
          ),
        },
        {
          id: 'repay',
          title: t('spokeForm.repay.tabTitle'),
          content: (
            <RepayForm spokePool={spokePool} asset={asset} onSubmitSuccess={onSubmitSuccess} />
          ),
        },
      ]
    : [];

  const collateralTabsDom = (
    <Tabs
      // Remounts on a new preselection so the leaf forms pick it up, which their initial state
      // alone would not do
      key={initialCollateral?.vToken.address}
      tabs={collateralTabs}
      initialActiveTabId={initialCollateralTabId}
      variant="primary"
    />
  );

  const loanTabsDom = (
    <Tabs tabs={loanTabs} initialActiveTabId={initialLoanTabId} variant="primary" />
  );

  // A pool missing one of the two sides offers the other on its own rather than an empty tab
  if (collateralTabs.length === 0) {
    return loanTabsDom;
  }

  if (loanTabs.length === 0) {
    return collateralTabsDom;
  }

  const tabs: Array<Tab & { id: SpokeFormTabId }> = [
    {
      id: 'collateral',
      title: t('spokeForm.collateralTabTitle'),
      content: collateralTabsDom,
    },
    {
      id: 'loan',
      title: t('spokeForm.loanTabTitle'),
      content: loanTabsDom,
    },
  ];

  return (
    <Tabs
      tabs={tabs}
      activeTabId={activeTabId}
      onTabChange={newIndex => setActiveTabId(tabs[newIndex].id)}
      navType={navType}
      variant="secondary"
    />
  );
};
