import BigNumber from 'bignumber.js';
import { XvsVesting } from 'types/contracts';

export interface IGetXvsWithdrawableAmountInput {
  xvsVestingContract: XvsVesting;
  accountAddress: string;
}

export interface IGetXvsWithdrawableAmountOutput {
  totalWithdrawableAmount: BigNumber;
  totalVestedAmount: BigNumber;
  totalWithdrawnAmount: BigNumber;
}

const getXvsWithdrawableAmount = async ({
  xvsVestingContract,
  accountAddress,
}: IGetXvsWithdrawableAmountInput): Promise<IGetXvsWithdrawableAmountOutput> => {
  const resp = await xvsVestingContract.methods.getWithdrawableAmount(accountAddress).call();
  return {
    totalWithdrawableAmount: new BigNumber(resp.totalWithdrawableAmount),
    totalVestedAmount: new BigNumber(resp.totalVestedAmount),
    totalWithdrawnAmount: new BigNumber(resp.totalWithdrawnAmount),
  };
};

export default getXvsWithdrawableAmount;
