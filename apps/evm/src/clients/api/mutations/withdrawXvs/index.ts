import type { XvsVesting } from 'libs/contracts';
import type { LooseEthersContractTxData } from 'types';

export interface WithdrawXvsInput {
  xvsVestingContract: XvsVesting;
}

export type WithdrawXvsOutput = LooseEthersContractTxData;

const withdrawXvs = ({ xvsVestingContract }: WithdrawXvsInput): WithdrawXvsOutput => ({
  contract: xvsVestingContract,
  methodName: 'withdraw',
  args: [],
});

export default withdrawXvs;
