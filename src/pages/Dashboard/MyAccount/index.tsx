/** @jsxImportSource @emotion/react */
import { BigNumber } from 'bignumber.js';
import React from 'react';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'config';
import {
  calculateApy,
  calculateDailyEarningsCents,
  calculateYearlyEarningsForAssets,
} from 'utilities';
import { Asset } from 'types';
import MyAccountUi, { IMyAccountUiProps } from './MyAccountUi';

interface IMyAccountProps {
  className?: string;
  isXvsEnabled: boolean;
  setIsXvsEnabled: (value: boolean) => void;
  assets: Asset[];
  userTotalBorrowLimit: BigNumber;
  userTotalBorrowBalance: BigNumber;
  userTotalSupplyBalance: BigNumber;
}

const MyAccount: React.FC<IMyAccountProps> = ({
  className,
  assets,
  isXvsEnabled,
  setIsXvsEnabled,
  userTotalBorrowLimit,
  userTotalBorrowBalance,
  userTotalSupplyBalance,
}) => {
  const calculations: Pick<
    IMyAccountUiProps,
    'netApyPercentage' | 'dailyEarningsCents' | 'supplyBalanceCents' | 'borrowLimitCents'
  > = React.useMemo(() => {
    const yearlyEarningsCents = calculateYearlyEarningsForAssets({
      assets,
      isXvsEnabled,
    });
    const supplyBalanceCents = userTotalSupplyBalance.multipliedBy(100);
    const netApyPercentage =
      supplyBalanceCents &&
      yearlyEarningsCents &&
      calculateApy({ supplyBalanceCents, yearlyEarningsCents });
    const dailyEarningsCents =
      yearlyEarningsCents && +calculateDailyEarningsCents(yearlyEarningsCents).toFixed(0);
    return {
      netApyPercentage,
      dailyEarningsCents,
      supplyBalanceCents: supplyBalanceCents?.toNumber(),
      borrowLimitCents: userTotalBorrowLimit.multipliedBy(100).toNumber(),
    };
  }, [JSON.stringify(assets), isXvsEnabled]);

  return (
    <MyAccountUi
      className={className}
      safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
      isXvsEnabled={isXvsEnabled}
      onXvsToggle={setIsXvsEnabled}
      borrowBalanceCents={+userTotalBorrowBalance.multipliedBy(100).toFixed()}
      {...calculations}
    />
  );
};

export default MyAccount;
