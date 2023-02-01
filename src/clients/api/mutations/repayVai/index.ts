import BigNumber from 'bignumber.js';
import { checkForVaiControllerTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';

import { VaiController } from 'types/contracts';

export interface RepayVaiInput {
  vaiControllerContract: VaiController;
  amountWei: BigNumber;
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
