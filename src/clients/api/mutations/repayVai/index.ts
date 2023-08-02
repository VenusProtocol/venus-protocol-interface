import BigNumber from 'bignumber.js';
import { checkForVaiControllerTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

export interface RepayVaiInput {
  amountWei: BigNumber;
  vaiControllerContract: ContractTypeByName<'vaiController'>;
}

export type IRepayVaiOutput = ContractReceipt;

const repayVai = async ({
  vaiControllerContract,
  amountWei,
}: RepayVaiInput): Promise<IRepayVaiOutput> => {
  const transaction = await vaiControllerContract.repayVAI(amountWei.toFixed());
  const receipt = await transaction.wait(1);
  return checkForVaiControllerTransactionError(receipt);
};

export default repayVai;
