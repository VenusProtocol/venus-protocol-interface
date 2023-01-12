import BigNumber from 'bignumber.js';

import { VaiController } from 'types/contracts';

import { GetVaiCalculateRepayAmountOutput } from './types';

const formatToOutput = (
  repayAmountWei: BigNumber,
  response: Awaited<
    ReturnType<ReturnType<VaiController['methods']['getVAICalculateRepayAmount']>['call']>
  >,
): GetVaiCalculateRepayAmountOutput => {
  // fix repay amount wei
  const feePercentage = new BigNumber(response[0]).times(100).dividedBy(repayAmountWei).toNumber();

  return {
    vaiToBeBurned: new BigNumber(response[0]),
    vaiCurrentInterest: new BigNumber(response[1]),
    vaiPastInterest: new BigNumber(response[2]),
    feePercentage,
  };
};

export default formatToOutput;
