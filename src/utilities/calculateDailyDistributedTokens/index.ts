import BigNumber from 'bignumber.js';

import { BLOCKS_PER_DAY } from 'constants/bsc';
import { COMPOUND_DECIMALS } from 'constants/compoundMantissa';

export interface CalculateDailyDistributedTokensInput {
  ratePerBlockMantissa: BigNumber | string | number;
  decimals?: number;
}

const calculateDailyDistributedTokens = ({
  ratePerBlockMantissa,
  decimals = COMPOUND_DECIMALS,
}: CalculateDailyDistributedTokensInput) =>
  new BigNumber(ratePerBlockMantissa)
    .div(new BigNumber(10).pow(decimals))
    .multipliedBy(BLOCKS_PER_DAY)
    .dp(decimals);

export default calculateDailyDistributedTokens;
