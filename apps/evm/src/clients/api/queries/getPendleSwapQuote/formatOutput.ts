import BigNumber from 'bignumber.js';
import type { PendleSwapApiResponse } from './types';

export const formatOutput = (input: PendleSwapApiResponse) => {
  const { contractCallParamsName, contractCallParams, requiredApprovals } = input;

  return {
    estimatedReceivedTokensMantissa: new BigNumber(input.estimatedOutput.amount),
    feeCents: new BigNumber(input.fee.usd).shiftedBy(2),
    priceImpactPercentage: input.priceImpact,
    pendleMarketAddress: input.pendleMarket,
    contractCallParamsName,
    contractCallParams,
    requiredApprovals,
  };
};
