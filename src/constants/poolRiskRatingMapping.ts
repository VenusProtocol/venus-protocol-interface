import { PoolRiskRating } from 'types';

const poolRiskRatingMapping: {
  [key in PoolRiskRating]: number;
} = {
  MINIMAL: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  VERY_HIGH: 4,
};

export default poolRiskRatingMapping;
