import type { LiquidityHubHistoryPeriod } from 'clients/api';
import type { MarketHistoryDataPoint, SpokeAsset } from 'types';

const DAYS_PER_PERIOD: Record<LiquidityHubHistoryPeriod, number> = {
  '1w': 7,
  '1m': 30,
  '3m': 90,
  '1y': 365,
  all: 730,
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MAX_POINT_COUNT = 90;

// Deterministic so the same market always draws the same curve
const pseudoRandom = (seed: number) => {
  const value = Math.sin(seed) * 10_000;
  return value - Math.floor(value);
};

const seedFromAddress = (address: string) =>
  address.split('').reduce((acc, character) => acc + character.charCodeAt(0), 0);

export interface GetSpokeMarketHistoryInput {
  asset: SpokeAsset;
  period: LiquidityHubHistoryPeriod;
}

export const getSpokeMarketHistory = ({
  asset,
  period,
}: GetSpokeMarketHistoryInput): MarketHistoryDataPoint[] => {
  const dayCount = DAYS_PER_PERIOD[period];
  const pointCount = Math.min(dayCount, MAX_POINT_COUNT);
  const daysPerPoint = dayCount / pointCount;

  const seed = seedFromAddress(asset.vToken.address);
  const currentApy = asset.borrowApyPercentage.toNumber();
  const currentBorrowCents = asset.borrowBalanceCents.toNumber();
  const nowMs = Date.now();

  return Array.from({ length: pointCount }, (_unused, index) => {
    const daysAgo = (pointCount - 1 - index) * daysPerPoint;
    const noise = pseudoRandom(seed + index) - 0.5;

    // Drift towards today's values so the series lands on the figures shown above the chart
    const progress = index / Math.max(pointCount - 1, 1);
    const apyDrift = (1 - progress) * 0.35;
    const borrowDrift = (1 - progress) * 0.3;

    return {
      blockTimestamp: Math.round(nowMs - daysAgo * MS_PER_DAY),
      borrowApyPercentage: Math.max(currentApy * (1 - apyDrift + noise * 0.22), 0.01),
      totalBorrowCents: Math.max(currentBorrowCents * (1 - borrowDrift + noise * 0.12), 0),
    };
  });
};
