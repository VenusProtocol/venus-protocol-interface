import BigNumber from 'bignumber.js';

import type { Pool, Vault } from 'types';
import {
  calculateDailyEarningsCents,
  calculateYearlyInterests,
  convertMantissaToTokens,
} from 'utilities';
import calculateNetApy from './calculateNetApy';

interface UseExtractDataInput {
  pool?: Pool;
  xvsPriceCents?: BigNumber;
  vaiPriceCents?: BigNumber;
  vaults?: Vault[];
}

export const useExtractData = ({
  pool,
  vaults,
  xvsPriceCents = new BigNumber(0),
  vaiPriceCents = new BigNumber(0),
}: UseExtractDataInput) => {
  let userTotalVaultStakeCents: BigNumber | undefined;
  let yearlyVaultEarningsCents: BigNumber | undefined;

  if (vaults) {
    vaults.forEach(vault => {
      const vaultStakeCents = convertMantissaToTokens({
        value: new BigNumber(vault.userStakedMantissa || 0),
        token: vault.stakedToken,
      }).multipliedBy(vault.stakedToken.symbol === 'XVS' ? xvsPriceCents : vaiPriceCents);

      if (!userTotalVaultStakeCents) {
        userTotalVaultStakeCents = new BigNumber(0);
      }

      if (!yearlyVaultEarningsCents) {
        yearlyVaultEarningsCents = new BigNumber(0);
      }

      userTotalVaultStakeCents = userTotalVaultStakeCents.plus(vaultStakeCents);
      yearlyVaultEarningsCents = yearlyVaultEarningsCents.plus(
        calculateYearlyInterests({
          balance: vaultStakeCents,
          interestPercentage: new BigNumber(vault.stakingAprPercentage),
        }),
      );
    });
  }

  const supplyBalanceCents = new BigNumber(pool?.userSupplyBalanceCents || 0)?.plus(
    userTotalVaultStakeCents || 0,
  );

  const yearlyEarningsCents = new BigNumber(pool?.userYearlyEarningsCents || 0)?.plus(
    yearlyVaultEarningsCents || 0,
  );

  const userNetApyPercentage = calculateNetApy({
    supplyBalanceCents,
    yearlyEarningsCents,
  });

  const userDailyEarningsCents = calculateDailyEarningsCents(yearlyEarningsCents);

  return {
    userTotalVaultStakeCents,
    userDailyEarningsCents,
    userNetApyPercentage,
  };
};
