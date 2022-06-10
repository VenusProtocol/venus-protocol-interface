/** @jsxImportSource @emotion/react */
import { BigNumber } from 'bignumber.js';
import React from 'react';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'config';
import {
  calculateNetApy,
  calculateDailyEarningsCents,
  calculateYearlyEarningsForAssets,
} from 'utilities';
import { Asset } from 'types';
import { useDailyXvs } from 'hooks/useDailyXvs';
import MyAccountUi, { IMyAccountUiProps } from './MyAccountUi';

interface IMyAccountProps {
  className?: string;
  isXvsEnabled: boolean;
  setIsXvsEnabled: (value: boolean) => void;
  assets: Asset[];
  userTotalBorrowLimitCents: BigNumber;
  userTotalBorrowBalanceCents: BigNumber;
  userTotalSupplyBalanceCents: BigNumber;
  accountAddress?: string;
}

const MyAccount: React.FC<IMyAccountProps> = ({
  className,
  assets,
  isXvsEnabled,
  setIsXvsEnabled,
  userTotalBorrowLimitCents,
  userTotalBorrowBalanceCents,
  userTotalSupplyBalanceCents,
  accountAddress,
}) => {
  const { dailyXvsDistributionInterestsCents } = useDailyXvs({
    assets,
    accountAddress,
  });

  const calculations: Pick<
    IMyAccountUiProps,
    'netApyPercentage' | 'dailyEarningsCents' | 'supplyBalanceCents' | 'borrowLimitCents'
  > = React.useMemo(() => {
    const yearlyEarningsCents = calculateYearlyEarningsForAssets({
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
