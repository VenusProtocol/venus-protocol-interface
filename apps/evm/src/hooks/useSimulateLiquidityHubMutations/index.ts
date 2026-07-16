import BigNumber from 'bignumber.js';

import type { BalanceMutation, LiquidityHub, LiquidityHubBalanceMutation } from 'types';
import { areAddressesEqual, calculateYearlyInterests, clampToZero } from 'utilities';

export interface UseSimulateLiquidityHubMutationsInput {
  liquidityHubs: LiquidityHub[];
  balanceMutations: BalanceMutation[];
}

export const useSimulateLiquidityHubMutations = ({
  liquidityHubs,
  balanceMutations,
}: UseSimulateLiquidityHubMutationsInput) => {
  // Filter out 0 balance mutations
  const filteredBalanceMutations = balanceMutations.filter(
    (balanceMutation): balanceMutation is LiquidityHubBalanceMutation =>
      balanceMutation.type === 'liquidityHub' && !balanceMutation.amountTokens.isEqualTo(0),
  );

  if (filteredBalanceMutations.length === 0) {
    return {
      liquidityHubs: [],
    };
  }

  const simulatedLiquidityHubs: LiquidityHub[] = liquidityHubs.map(liquidityHub => {
    const hubBalanceMutations = filteredBalanceMutations.filter(balanceMutation =>
      areAddressesEqual(balanceMutation.vhTokenAddress, liquidityHub.vhToken.address),
    );

    if (hubBalanceMutations.length === 0) {
      return liquidityHub;
    }

    let supplyBalanceTokens = liquidityHub.supplyBalanceTokens;
    let supplyBalanceCents = liquidityHub.supplyBalanceCents;
    let userSupplyBalanceTokens = liquidityHub.userSupplyBalanceTokens ?? new BigNumber(0);

    hubBalanceMutations.forEach(balanceMutation => {
      const amountCents = balanceMutation.amountTokens.multipliedBy(liquidityHub.tokenPriceCents);

      if (balanceMutation.action === 'supply') {
        supplyBalanceTokens = supplyBalanceTokens.plus(balanceMutation.amountTokens);
        supplyBalanceCents = supplyBalanceCents.plus(amountCents);
        userSupplyBalanceTokens = userSupplyBalanceTokens.plus(balanceMutation.amountTokens);
      } else {
        supplyBalanceTokens = clampToZero({
          value: supplyBalanceTokens.minus(balanceMutation.amountTokens),
        });
        supplyBalanceCents = clampToZero({
          value: supplyBalanceCents.minus(amountCents),
        });
        userSupplyBalanceTokens = clampToZero({
          value: userSupplyBalanceTokens.minus(balanceMutation.amountTokens),
        });
      }
    });

    const userSupplyBalanceCents = userSupplyBalanceTokens.multipliedBy(
      liquidityHub.tokenPriceCents,
    );

    const userYearlyEarningsCents = calculateYearlyInterests({
      balance: userSupplyBalanceCents,
      interestPercentage: liquidityHub.supplyApyPercentage,
    });

    const userVhTokenBalanceTokens = liquidityHub.pricePerShare.isZero()
      ? new BigNumber(0)
      : userSupplyBalanceTokens.dividedBy(liquidityHub.pricePerShare);

    return {
      ...liquidityHub,
      supplyBalanceTokens,
      supplyBalanceCents,
      userSupplyBalanceTokens,
      userSupplyBalanceCents,
      userYearlyEarningsCents,
      userVhTokenBalanceTokens,
    };
  });

  return {
    liquidityHubs: simulatedLiquidityHubs,
  };
};
