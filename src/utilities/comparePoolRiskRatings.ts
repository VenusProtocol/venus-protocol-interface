import { PoolRiskRating } from 'types';

import poolRiskRatingMapping from 'constants/poolRiskRatingMapping';

import compareNumbers from './compareNumbers';

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
