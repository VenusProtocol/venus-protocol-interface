import BigNumber from 'bignumber.js';
import _ from 'lodash';
import type { PendleSwapApiResponse } from './types';

export const formatOutput = (input: PendleSwapApiResponse) => {
  return {
    estReceiveMantissa: new BigNumber(input.estimatedOutput.amount),
    feeUsdCents: new BigNumber(input.fee.usd).shiftedBy(2),
    priceImpactPercentage: input.priceImpact,
    pendleMarketAddress: input.pendleMarket,
    ..._.pick(input, ['contractCallParamsName', 'contractCallParams', 'requiredApprovals']),
  };
};
