import type { XvsVesting } from 'libs/contracts';
import type { ContractTxData } from 'types';

export interface WithdrawXvsInput {
  xvsVestingContract: XvsVesting;
}

export type WithdrawXvsOutput = ContractTxData<XvsVesting, 'withdraw'>;

const withdrawXvs = async ({
  xvsVestingContract,
}: WithdrawXvsInput): Promise<WithdrawXvsOutput> => ({
  contract: xvsVestingContract,
  methodName: 'withdraw',
  args: [],
});

export default withdrawXvs;
