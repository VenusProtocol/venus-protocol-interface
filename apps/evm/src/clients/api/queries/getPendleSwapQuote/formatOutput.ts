import BigNumber from 'bignumber.js';
import { pick } from 'lodash-es';
import type { PendleSwapApiResponse } from './types';

export const formatOutput = (input: PendleSwapApiResponse) => {
  return {
    estimatedReceivedTokensMantissa: new BigNumber(input.estimatedOutput.amount),
    feeCents: new BigNumber(input.fee.usd).shiftedBy(2),
    priceImpactPercentage: input.priceImpact,
    pendleMarketAddress: input.pendleMarket,
    ...pick(input, ['contractCallParamsName', 'contractCallParams', 'requiredApprovals']),
  };
};
