import BigNumber from 'bignumber.js';

import { BLOCKS_PER_DAY } from 'constants/bsc';
import { COMPOUND_DECIMALS, COMPOUND_MANTISSA } from 'constants/compoundMantissa';

export interface CalculateDailyDistributedTokensInput {
  ratePerBlockMantissa: BigNumber | string | number;
}

const calculateDailyDistributedTokens = ({
  ratePerBlockMantissa,
}: CalculateDailyDistributedTokensInput) =>
  new BigNumber(ratePerBlockMantissa)
    .div(COMPOUND_MANTISSA)
    .multipliedBy(BLOCKS_PER_DAY)
    .dp(COMPOUND_DECIMALS);

export default calculateDailyDistributedTokens;
