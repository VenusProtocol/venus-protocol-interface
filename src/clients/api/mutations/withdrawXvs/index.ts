import { ContractReceipt } from 'ethers';
import { XvsVesting } from 'packages/contractsNew';

export interface WithdrawXvsInput {
  xvsVestingContract: XvsVesting;
}

export type WithdrawXvsOutput = ContractReceipt;

const withdrawXvs = async ({
  xvsVestingContract,
}: WithdrawXvsInput): Promise<WithdrawXvsOutput> => {
  const transaction = await xvsVestingContract.withdraw();
  return transaction.wait(1);
};

export default withdrawXvs;
