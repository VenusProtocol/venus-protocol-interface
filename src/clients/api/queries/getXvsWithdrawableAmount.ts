import { XvsVesting } from 'types/contracts';

export interface IGetXvsWithdrawableAmountInput {
  xvsVestingContract: XvsVesting;
  accountAddress: string;
}

export interface IGetXvsWithdrawableAmountOutput {
  totalWithdrawableAmount: string;
  totalVestedAmount: string;
  totalWithdrawnAmount: string;
}

const getXvsWithdrawableAmount = ({
  xvsVestingContract,
  accountAddress,
}: IGetXvsWithdrawableAmountInput): Promise<IGetXvsWithdrawableAmountOutput> =>
  xvsVestingContract.methods.getWithdrawableAmount(accountAddress).call();

export default getXvsWithdrawableAmount;
