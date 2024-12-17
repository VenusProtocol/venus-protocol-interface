import BigNumber from 'bignumber.js';
import type { VaiController } from 'libs/contracts';

export const getUserVaiBorrowBalance = async ({
  accountAddress,
  vaiControllerContract,
}: { accountAddress: string; vaiControllerContract?: VaiController }) => {
  const [_accrueVaiInterest, vaiRepayAmountMantissa] = await Promise.all([
    // Call (statically) accrueVAIInterest to calculate past accrued interests before fetching all
    // interests. Since multicall will batch these requests, the call to accrueVAIInterest and
    // getVAIRepayAmount will happen in the same request (thus making the accrual possible)
    vaiControllerContract ? vaiControllerContract.callStatic.accrueVAIInterest() : undefined,
    vaiControllerContract ? vaiControllerContract.getVAIRepayAmount(accountAddress) : undefined,
  ]);

  const userVaiBorrowBalanceMantissa = vaiRepayAmountMantissa
    ? new BigNumber(vaiRepayAmountMantissa.toString())
    : undefined;

  return { userVaiBorrowBalanceMantissa };
};
