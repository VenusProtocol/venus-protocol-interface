import { PoolRiskRating } from 'types';

const poolRiskRatingMapping: {
  [key in PoolRiskRating]: number;
} = {
  MINIMAL_RISK: 0,
  LOW_RISK: 1,
  MEDIUM_RISK: 2,
  HIGH_RISK: 3,
  VERY_HIGH_RISK: 4,
};

export default poolRiskRatingMapping;
