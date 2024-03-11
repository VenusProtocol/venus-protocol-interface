import BigNumber from 'bignumber.js';

import { GetVaiCalculateRepayAmountInput, GetVaiCalculateRepayAmountOutput } from './types';

const getVaiCalculateRepayAmount = async ({
  vaiControllerContract,
  accountAddress,
  repayAmountMantissa,
}: GetVaiCalculateRepayAmountInput): Promise<GetVaiCalculateRepayAmountOutput> => {
  const [
    _accrueVaiInterestResult,
    [
      vaiRepayAmountAfterFeeMantissaResult,
      vaiCurrentInterestMantissaResult,
      vaiPastInterestMantissaResult,
    ],
  ] = await Promise.all([
    // Call (statically) accrueVAIInterest to calculate past accrued interests before fetching all
    // interests
    vaiControllerContract.callStatic.accrueVAIInterest(),
    vaiControllerContract.getVAICalculateRepayAmount(accountAddress, repayAmountMantissa.toFixed()),
  ]);

  const vaiTotalInterestMantissa = new BigNumber(vaiCurrentInterestMantissaResult.toString()).plus(
    vaiPastInterestMantissaResult.toString(),
  );
  const feePercentage = repayAmountMantissa.isGreaterThan(0)
    ? new BigNumber(vaiTotalInterestMantissa).times(100).dividedBy(repayAmountMantissa).toNumber()
    : 0;

  return {
    vaiRepayAmountAfterFeeMantissa: new BigNumber(vaiRepayAmountAfterFeeMantissaResult.toString()),
    vaiCurrentInterestMantissa: new BigNumber(vaiCurrentInterestMantissaResult.toString()),
    vaiPastInterestMantissa: new BigNumber(vaiPastInterestMantissaResult.toString()),
    vaiTotalInterestMantissa,
    feePercentage,
  };
};

export default getVaiCalculateRepayAmount;
