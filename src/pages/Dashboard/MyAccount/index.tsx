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

const MyAccount: React.FC = () => {
  const { account } = React.useContext(AuthContext);
  const { assets, userTotalBorrowBalance, userTotalBorrowLimit } = useUserMarketInfo({
    account: account?.address,
  });

  // @TODO: elevate state so it can be shared with borrow and supply markets
  const [isXvsEnabled, setIsXvsEnabled] = React.useState(true);

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
      yearlyEarningsCents && +calculateDailyEarningsCents(yearlyEarningsCents);

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
      withXvs={isXvsEnabled}
      onXvsToggle={setIsXvsEnabled}
      {...calculations}
    />
  );
};

export default MyAccount;
