import { ContractReceipt } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

export interface WithdrawXvsInput {
  xvsVestingContract: ContractTypeByName<'xvsVesting'>;
}

export type WithdrawXvsOutput = ContractReceipt;

const withdrawXvs = async ({
  xvsVestingContract,
}: WithdrawXvsInput): Promise<WithdrawXvsOutput> => {
  const transaction = await xvsVestingContract.withdraw();
  return transaction.wait(1);
};

export default withdrawXvs;
