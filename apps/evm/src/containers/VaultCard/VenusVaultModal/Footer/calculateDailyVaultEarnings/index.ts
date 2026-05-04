import BigNumber from 'bignumber.js';

import type { Vault } from 'types';
import { calculateDailyInterests, calculateYearlyInterests } from 'utilities';

export const calculateDailyVaultEarnings = ({
  balance,
  vault,
}: {
  balance: BigNumber;
  vault: Vault;
}) => {
  const yearlyEarnings = calculateYearlyInterests({
    balance,
    interestPercentage: new BigNumber(vault.stakingAprPercentage),
  })
    // Convert to reward tokens
    .multipliedBy(vault.stakedTokenPriceCents)
    .dividedBy(vault.rewardTokenPriceCents);

  const dailyEarnings = calculateDailyInterests(yearlyEarnings);

  return dailyEarnings;
};
