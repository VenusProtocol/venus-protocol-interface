import type { GetVTokenApySimulationsOutput } from 'clients/api';
import type { SpokeAsset } from 'types';

const KINK_PERCENTAGE = 80;
const BASE_APY_PERCENTAGE = 0;
const MULTIPLIER = 0.0875;
const JUMP_MULTIPLIER = 0.8;

export interface GetSpokeIrmSimulationsInput {
  asset: SpokeAsset;
}

// Venus jump-rate model: linear up to the kink, then steep to price scarce liquidity
const borrowApyAt = (utilizationRatePercentage: number) => {
  if (utilizationRatePercentage <= KINK_PERCENTAGE) {
    return BASE_APY_PERCENTAGE + utilizationRatePercentage * MULTIPLIER;
  }

  return (
    BASE_APY_PERCENTAGE +
    KINK_PERCENTAGE * MULTIPLIER +
    (utilizationRatePercentage - KINK_PERCENTAGE) * JUMP_MULTIPLIER
  );
};

export const getSpokeIrmSimulations = ({
  asset,
}: GetSpokeIrmSimulationsInput): GetVTokenApySimulationsOutput => {
  const reserveFactor = asset.reserveFactor ?? 0;

  const apySimulations = Array.from({ length: 101 }, (_unused, utilizationRatePercentage) => {
    const borrowApyPercentage = borrowApyAt(utilizationRatePercentage);

    return {
      utilizationRatePercentage,
      borrowApyPercentage,
      supplyApyPercentage:
        (borrowApyPercentage * utilizationRatePercentage * (1 - reserveFactor)) / 100,
    };
  });

  const supplyBalanceTokens = asset.supplyBalanceTokens.toNumber();
  const currentUtilizationRatePercentage =
    supplyBalanceTokens > 0
      ? Math.round((asset.borrowBalanceTokens.toNumber() / supplyBalanceTokens) * 100)
      : 0;

  return { apySimulations, currentUtilizationRatePercentage };
};
