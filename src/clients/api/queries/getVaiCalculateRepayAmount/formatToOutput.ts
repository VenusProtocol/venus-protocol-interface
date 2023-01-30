import BigNumber from 'bignumber.js';
import { ContractCallResults } from 'ethereum-multicall';

import { GetVaiCalculateRepayAmountOutput } from './types';

const formatToOutput = ({
  repayAmountWei,
  contractCallResults,
}: {
  repayAmountWei: BigNumber;
  contractCallResults: ContractCallResults;
}): GetVaiCalculateRepayAmountOutput => {
  const [vaiRepayAmountAfterFeeWei, vaiCurrentInterestWei, vaiPastInterestWei] =
    contractCallResults.results.getVaiRepayInterests.callsReturnContext[1].returnValues.map(
      unformattedBigNumber => new BigNumber(unformattedBigNumber.hex),
    );

  const vaiTotalInterestWei = vaiCurrentInterestWei.plus(vaiPastInterestWei);
  const feePercentage = repayAmountWei.isGreaterThan(0)
    ? new BigNumber(vaiTotalInterestWei).times(100).dividedBy(repayAmountWei).toNumber()
    : 0;

  return {
    vaiRepayAmountAfterFeeWei,
    vaiCurrentInterestWei,
    vaiPastInterestWei,
    vaiTotalInterestWei,
    feePercentage,
  };
};

export default formatToOutput;
