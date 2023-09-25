import BigNumber from 'bignumber.js';

import { GetVaiCalculateRepayAmountInput, GetVaiCalculateRepayAmountOutput } from './types';

const getVaiCalculateRepayAmount = async ({
  vaiControllerContract,
  accountAddress,
  repayAmountWei,
}: GetVaiCalculateRepayAmountInput): Promise<GetVaiCalculateRepayAmountOutput> => {
  const [
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _accrueVaiInterestResult,
    [vaiRepayAmountAfterFeeWeiResult, vaiCurrentInterestWeiResult, vaiPastInterestWeiResult],
  ] = await Promise.all([
    // Call (statically) accrueVAIInterest to calculate past accrued interests before fetching all
    // interests
    vaiControllerContract.callStatic.accrueVAIInterest(),
    vaiControllerContract.getVAICalculateRepayAmount(accountAddress, repayAmountWei.toFixed()),
  ]);

  const vaiTotalInterestWei = new BigNumber(vaiCurrentInterestWeiResult.toString()).plus(
    vaiPastInterestWeiResult.toString(),
  );
  const feePercentage = repayAmountWei.isGreaterThan(0)
    ? new BigNumber(vaiTotalInterestWei).times(100).dividedBy(repayAmountWei).toNumber()
    : 0;

  return {
    vaiRepayAmountAfterFeeWei: new BigNumber(vaiRepayAmountAfterFeeWeiResult.toString()),
    vaiCurrentInterestWei: new BigNumber(vaiCurrentInterestWeiResult.toString()),
    vaiPastInterestWei: new BigNumber(vaiPastInterestWeiResult.toString()),
    vaiTotalInterestWei,
    feePercentage,
  };
};

export default getVaiCalculateRepayAmount;
