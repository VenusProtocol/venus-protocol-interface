import { checkForVaiControllerTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core';

import { VaiController } from 'types/contracts';

export interface RepayVaiInput {
  vaiControllerContract: VaiController;
  fromAccountAddress: string;
  amountWei: string;
}

export type IRepayVaiOutput = TransactionReceipt;

const repayVai = async ({
  vaiControllerContract,
  fromAccountAddress,
  amountWei,
}: RepayVaiInput): Promise<IRepayVaiOutput> => {
  const resp = await vaiControllerContract.methods
    .repayVAI(amountWei)
    .send({ from: fromAccountAddress });
  return checkForVaiControllerTransactionError(resp);
};

export default repayVai;
