import type { TransactionReceipt } from 'web3-core/types';
import { XvsVesting } from 'types/contracts';
import { checkForTransactionError } from 'utilities/errors';

export interface IWithdrawXvsInput {
  xvsVestingContract: XvsVesting;
  accountAddress: string;
}

export type WithdrawXvsOutput = TransactionReceipt;

const withdrawXvs = async ({
  xvsVestingContract,
  accountAddress,
}: IWithdrawXvsInput): Promise<WithdrawXvsOutput> => {
  const resp = await xvsVestingContract.methods.withdraw().send({
    from: accountAddress,
  });
  return checkForTransactionError(resp);
};

export default withdrawXvs;
