/** @jsxImportSource @emotion/react */
import React from 'react';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'config';
import { AuthContext } from 'context/AuthContext';
import useUserMarketInfo from 'hooks/useUserMarketInfo';
import {
  calculateApy,
  calculateDailyEarningsCents,
  calculateYearlyEarningsForAssets,
} from 'utilities';
import MyAccountUi, { IMyAccountUiProps } from './MyAccountUi';

interface IMyAccountProps {
  isXvsEnabled: boolean;
  setIsXvsEnabled: (value: boolean) => void;
}

const MyAccount: React.FC<IMyAccountProps> = ({ isXvsEnabled, setIsXvsEnabled }) => {
  const { account } = React.useContext(AuthContext);
  const { assets, userTotalBorrowBalance, userTotalBorrowLimit } = useUserMarketInfo({
    account: account?.address,
  });

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
