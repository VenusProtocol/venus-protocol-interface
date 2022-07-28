import type { TransactionReceipt } from 'web3-core/types';

import { XvsVesting } from 'types/contracts';

export interface WithdrawXvsInput {
  xvsVestingContract: XvsVesting;
  accountAddress: string;
}

export type WithdrawXvsOutput = TransactionReceipt;

const withdrawXvs = ({
  xvsVestingContract,
  accountAddress,
}: WithdrawXvsInput): Promise<WithdrawXvsOutput> =>
  xvsVestingContract.methods.withdraw().send({
    from: accountAddress,
  });

export default withdrawXvs;
