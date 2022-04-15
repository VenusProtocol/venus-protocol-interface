/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'config';
import { AuthContext } from 'context/AuthContext';
import useUserMarketInfo from 'hooks/useUserMarketInfo';
import MyAccountUi, { IMyAccountUiProps } from './MyAccountUi';

const MyAccount: React.FC = () => {
  const { account } = React.useContext(AuthContext);
  const assets = useUserMarketInfo({ account: account?.address });

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
    let supplyBalanceCents: BigNumber | undefined;
    let borrowBalanceCents: BigNumber | undefined;
    let borrowLimitCents: BigNumber | undefined;

    // We use the yearly earnings to calculate the daily earnings the net APY
    let yearlyEarningsCents: BigNumber | undefined;

    assets.forEach(asset => {
      // Initialize values to 0. Note that we only initialize the values if at
      // least one asset has been fetched (we don't want to display zeros while
      // the query is loading or if a fetching error happens)
      if (!borrowBalanceCents) {
        borrowBalanceCents = new BigNumber(0);
      }

      if (!supplyBalanceCents) {
        supplyBalanceCents = new BigNumber(0);
      }

      if (!borrowLimitCents) {
        borrowLimitCents = new BigNumber(0);
      }

      if (!yearlyEarningsCents) {
        yearlyEarningsCents = new BigNumber(0);
      }

      borrowBalanceCents = borrowBalanceCents.plus(
        asset.borrowBalance.multipliedBy(asset.tokenPrice).multipliedBy(100),
      );
      supplyBalanceCents = supplyBalanceCents.plus(
        asset.supplyBalance.multipliedBy(asset.tokenPrice).multipliedBy(100),
      );

      // Update borrow limit if asset is currently enabled as collateral
      if (asset.collateral) {
        // @TODO: use reusable util once implemented
        // (see https://app.clickup.com/t/26pg8t0)
        borrowLimitCents = borrowLimitCents.plus(
          supplyBalanceCents.multipliedBy(asset.collateralFactor),
        );
      }

      const supplyYearlyEarnings = supplyBalanceCents.multipliedBy(asset.supplyApy).dividedBy(100);
      // Note that borrowYearlyInterests will always be negative (or 0), since
      // the borrow APY is expressed with a negative percentage)
      const borrowYearlyInterests = borrowBalanceCents.multipliedBy(asset.borrowApy).dividedBy(100);

      yearlyEarningsCents = yearlyEarningsCents.plus(
        supplyYearlyEarnings.plus(borrowYearlyInterests),
      );

      // Add XVS distribution earnings if enabled
      if (isXvsEnabled) {
        const supplyDistributionYearlyEarnings = supplyBalanceCents
          .multipliedBy(asset.xvsSupplyApy)
          .dividedBy(100);
        const borrowDistributionYearlyEarnings = borrowBalanceCents
          .multipliedBy(asset.xvsBorrowApy)
          .dividedBy(100);

        yearlyEarningsCents = yearlyEarningsCents
          .plus(supplyDistributionYearlyEarnings)
          .plus(borrowDistributionYearlyEarnings);
      }
    });

    // Calculate net APY as a percentage of supply balance, based on yearly interests
    let netApyPercentage: number | undefined;

    if (supplyBalanceCents?.isEqualTo(0)) {
      netApyPercentage = 0;
    } else if (supplyBalanceCents && yearlyEarningsCents) {
      netApyPercentage = +yearlyEarningsCents
        .multipliedBy(100)
        .dividedBy(supplyBalanceCents)
        .toFixed(2);
    }

    // @TODO: use reusable util once implemented (see
    // https://app.clickup.com/t/26pg8j3)
    const dailyEarningsCents =
      yearlyEarningsCents && +yearlyEarningsCents.dividedBy(365).toFixed(0);

    return {
      netApyPercentage,
      dailyEarningsCents,
      supplyBalanceCents: supplyBalanceCents?.toNumber(),
      borrowBalanceCents: borrowBalanceCents?.toNumber(),
      borrowLimitCents: borrowLimitCents && +borrowLimitCents.toFixed(0),
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
