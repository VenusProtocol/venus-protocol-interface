import React from 'react';
import BigNumber from 'bignumber.js';
import { MyAccountUi } from './index';
import { useMyAccountData } from './useMyAccountData';

// util lets to work with legacy values format
const centsToDollars = (value: string | number | BigNumber): number => Number(value) * 100;

// Added container that uses existing calculation to display values.
// Calculations have to be refactored with using react-query
export const MyAccountContainerLegacy = () => {
  const { totalSupply, netAPY, withXVS, setWithXVS, totalBorrow, available, borrowPercent } =
    useMyAccountData();

  return (
    <MyAccountUi
      netApyPercentage={netAPY}
      dailyEarningsCents={0}
      supplyBalanceCents={centsToDollars(totalSupply)}
      borrowBalanceCents={centsToDollars(totalBorrow)}
      borrowLimitCents={centsToDollars(available)}
      safeLimitPercentage={80}
      borrowLimitUsedPercentage={borrowPercent}
      onSwitch={() => setWithXVS(!withXVS)}
      isSwitched={withXVS}
      trackTooltip="trackTooltip"
      markTooltip="markTooltip"
    />
  );
};

export default MyAccountContainerLegacy;
