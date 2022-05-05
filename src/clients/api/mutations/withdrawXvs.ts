import type { TransactionReceipt } from 'web3-core/types';
import { XvsVesting } from 'types/contracts';

export interface IWithdrawXvsInput {
  xvsVestingContract: XvsVesting;
  accountAddress: string;
}

export type WithdrawXvsOutput = TransactionReceipt;

const withdrawXvs = async ({
  xvsVestingContract,
  accountAddress,
}: IWithdrawXvsInput): Promise<WithdrawXvsOutput> =>
  xvsVestingContract.methods.withdraw().send({
    from: accountAddress,
  });

export default withdrawXvs;
