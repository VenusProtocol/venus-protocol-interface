/** @jsxImportSource @emotion/react */
import { BigNumber } from 'bignumber.js';
import React from 'react';
import { Asset } from 'types';
import {
  calculateDailyEarningsCents,
  calculateNetApy,
  calculateYearlyEarningsForAssets,
} from 'utilities';

import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';
import { useDailyXvsWei } from 'hooks/useDailyXvsWei';

import MyAccountUi, { MyAccountUiProps } from './MyAccountUi';

interface MyAccountProps {
  className?: string;
  isXvsEnabled: boolean;
  setIsXvsEnabled: (value: boolean) => void;
  assets: Asset[];
  userTotalBorrowLimitCents: BigNumber;
  userTotalBorrowBalanceCents: BigNumber;
  userTotalSupplyBalanceCents: BigNumber;
}

const MyAccount: React.FC<MyAccountProps> = ({
  className,
  assets,
  isXvsEnabled,
  setIsXvsEnabled,
  userTotalBorrowLimitCents,
  userTotalBorrowBalanceCents,
  userTotalSupplyBalanceCents,
}) => {
  // TODO: handle loading state
  const { dailyXvsDistributionInterestsCents } = useDailyXvsWei();

  const calculations: Pick<
    MyAccountUiProps,
    'netApyPercentage' | 'dailyEarningsCents' | 'supplyBalanceCents' | 'borrowLimitCents'
  > = React.useMemo(() => {
    const yearlyEarningsCents =
      dailyXvsDistributionInterestsCents &&
      calculateYearlyEarningsForAssets({
        assets,
        isXvsEnabled,
        dailyXvsDistributionInterestsCents,
      });
    const netApyPercentage =
      userTotalSupplyBalanceCents &&
      yearlyEarningsCents &&
      calculateNetApy({
        supplyBalanceCents: userTotalSupplyBalanceCents,
        yearlyEarningsCents,
      });
    const dailyEarningsCents =
      yearlyEarningsCents && +calculateDailyEarningsCents(yearlyEarningsCents).toFixed(0);
    return {
      netApyPercentage,
      dailyEarningsCents,
      supplyBalanceCents: userTotalSupplyBalanceCents?.toNumber(),
      borrowLimitCents: userTotalBorrowLimitCents.toNumber(),
    };
  }, [JSON.stringify(assets), isXvsEnabled, dailyXvsDistributionInterestsCents]);

  return (
    <MyAccountUi
      className={className}
      safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
      isXvsEnabled={isXvsEnabled}
      onXvsToggle={setIsXvsEnabled}
      borrowBalanceCents={+userTotalBorrowBalanceCents.toFixed()}
      {...calculations}
    />
  );
};

export default MyAccount;
