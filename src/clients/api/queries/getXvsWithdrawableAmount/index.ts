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
  const resp = await xvsVestingContract.getWithdrawableAmount(accountAddress);
  return {
    totalWithdrawableAmount: new BigNumber(resp.totalWithdrawableAmount.toString()),
    totalVestedAmount: new BigNumber(resp.totalVestedAmount.toString()),
    totalWithdrawnAmount: new BigNumber(resp.totalWithdrawnAmount.toString()),
  };
};

export default getXvsWithdrawableAmount;
