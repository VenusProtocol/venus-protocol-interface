import BigNumber from 'bignumber.js';

import {
  type LiquidityHub,
  type Pool,
  type SpokePool,
  type TradePosition,
  type Vault,
  VaultType,
} from 'types';
import { calculateDailyInterests, calculateYearlyInterests } from 'utilities';
import calculateNetApy from './calculateNetApy';

interface UseExtractDataInput {
  pool?: Pool;
  vaults?: Vault[];
  spokePools?: SpokePool[];
  liquidityHubs?: LiquidityHub[];
  tradePositions?: TradePosition[];
}

export const useExtractData = ({
  pool,
  vaults,
  spokePools = [],
  liquidityHubs = [],
  tradePositions = [],
}: UseExtractDataInput) => {
  const userTotalVaultStakeCents = vaults?.length
    ? vaults.reduce((acc, vault) => acc.plus(vault.userStakeBalanceCents || 0), new BigNumber(0))
    : undefined;

  const yieldingVaults = (vaults ?? []).filter(vault => vault.vaultType !== VaultType.Pendle);

  const positions = [
    {
      supplyCents: new BigNumber(pool?.userSupplyBalanceCents || 0),
      yearlyEarningsCents: new BigNumber(pool?.userYearlyEarningsCents || 0),
    },
    ...spokePools.map(spokePool => ({
      supplyCents: new BigNumber(spokePool.userSupplyBalanceCents || 0),
      yearlyEarningsCents: new BigNumber(spokePool.userYearlyEarningsCents || 0),
    })),
    ...liquidityHubs.map(liquidityHub => ({
      supplyCents: new BigNumber(liquidityHub.userVhTokenBalanceCents || 0),
      yearlyEarningsCents: new BigNumber(liquidityHub.userYearlyEarningsCents || 0),
    })),
    ...yieldingVaults.map(vault => {
      const supplyCents = new BigNumber(vault.userStakeBalanceCents || 0);

      return {
        supplyCents,
        yearlyEarningsCents: calculateYearlyInterests({
          balance: supplyCents,
          interestPercentage: new BigNumber(vault.stakeAprPercentage),
        }),
      };
    }),
    ...tradePositions.map(tradePosition => {
      const supplyCents = new BigNumber(tradePosition.dsaBalanceCents).plus(
        tradePosition.longBalanceCents,
      );

      return {
        supplyCents,
        yearlyEarningsCents: calculateYearlyInterests({
          balance: supplyCents,
          interestPercentage: new BigNumber(tradePosition.netApyPercentage),
        }),
      };
    }),
  ];

  const supplyBalanceCents = positions.reduce(
    (acc, position) => acc.plus(position.supplyCents),
    new BigNumber(0),
  );

  const yearlyEarningsCents = positions.reduce(
    (acc, position) => acc.plus(position.yearlyEarningsCents),
    new BigNumber(0),
  );

  const userNetApyPercentage = calculateNetApy({
    supplyBalanceCents,
    yearlyEarningsCents,
  });

  const userDailyEarningsCents = calculateDailyInterests(yearlyEarningsCents);

  return {
    userTotalVaultStakeCents,
    userDailyEarningsCents,
    userNetApyPercentage,
  };
};
