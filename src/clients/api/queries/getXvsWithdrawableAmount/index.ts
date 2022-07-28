import BigNumber from 'bignumber.js';

import { XvsVesting } from 'types/contracts';

export interface GetXvsWithdrawableAmountInput {
  xvsVestingContract: XvsVesting;
  accountAddress: string;
}

export interface GetXvsWithdrawableAmountOutput {
  totalWithdrawableAmount: BigNumber;
  totalVestedAmount: BigNumber;
  totalWithdrawnAmount: BigNumber;
}

const getXvsWithdrawableAmount = async ({
  xvsVestingContract,
  accountAddress,
}: GetXvsWithdrawableAmountInput): Promise<GetXvsWithdrawableAmountOutput> => {
  const resp = await xvsVestingContract.methods.getWithdrawableAmount(accountAddress).call();
  return {
    totalWithdrawableAmount: new BigNumber(resp.totalWithdrawableAmount),
    totalVestedAmount: new BigNumber(resp.totalVestedAmount),
    totalWithdrawnAmount: new BigNumber(resp.totalWithdrawnAmount),
  };
};

export default getXvsWithdrawableAmount;
