import { PoolRiskRating } from 'types';

import compareNumbers from './compareNumbers';

const poolRiskRatingMapping: {
  [key in PoolRiskRating]: number;
} = {
  MINIMAL: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  VERY_HIGH: 4,
};

const comparePoolRiskRatings = (
  valueA: PoolRiskRating | undefined,
  valueB: PoolRiskRating | undefined,
  direction: 'asc' | 'desc',
): number => {
  if (valueA === undefined || valueB === undefined) {
    return 0;
  }

  return compareNumbers(poolRiskRatingMapping[valueA], poolRiskRatingMapping[valueB], direction);
};

export default comparePoolRiskRatings;
