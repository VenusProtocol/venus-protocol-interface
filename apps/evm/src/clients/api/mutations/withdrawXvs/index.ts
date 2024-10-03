import type { XvsVesting } from 'libs/contracts';
import type { ContractTransaction } from 'types';
import { requestGaslessTransaction } from 'utilities/requestGaslessTransaction';

export interface WithdrawXvsInput {
  xvsVestingContract: XvsVesting;
}

export type WithdrawXvsOutput = ContractTransaction;

const withdrawXvs = async ({ xvsVestingContract }: WithdrawXvsInput): Promise<WithdrawXvsOutput> =>
  requestGaslessTransaction(xvsVestingContract, 'withdraw', []);

export default withdrawXvs;
