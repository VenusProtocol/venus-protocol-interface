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
  isXvsEnabled: boolean;
  setIsXvsEnabled: (value: boolean) => void;
  assets: Asset[];
  userTotalBorrowBalance: BigNumber;
  userTotalBorrowLimit: BigNumber;
}

const MyAccount: React.FC<IMyAccountProps> = ({
  assets,
  isXvsEnabled,
  setIsXvsEnabled,
  userTotalBorrowBalance,
  userTotalBorrowLimit,
}) => {
  const calculations: Pick<
    IMyAccountUiProps,
    | 'netApyPercentage'
    | 'dailyEarningsCents'
    | 'supplyBalanceCents'
    | 'borrowBalanceCents'
    | 'borrowLimitCents'
  > = React.useMemo(() => {
    const borrowBalanceCents = userTotalBorrowBalance.multipliedBy(100);
    const { supplyBalanceCents, yearlyEarningsCents } = calculateYearlyEarningsForAssets({
      assets,
      borrowBalanceCents,
      isXvsEnabled,
    });
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
      borrowBalanceCents: borrowBalanceCents?.toNumber(),
      borrowLimitCents: userTotalBorrowLimit.multipliedBy(100).toNumber(),
    };
  }, [JSON.stringify(assets), isXvsEnabled]);

  return (
    <MyAccountUi
      safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
      isXvsEnabled={isXvsEnabled}
      onXvsToggle={setIsXvsEnabled}
      {...calculations}
    />
  );
};

export default MyAccount;
