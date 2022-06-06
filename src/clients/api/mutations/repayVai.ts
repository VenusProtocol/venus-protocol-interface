import type { TransactionReceipt } from 'web3-core';
import { VaiUnitroller } from 'types/contracts';
import { checkForVaiControllerTransactionError } from 'errors';

export interface IRepayVaiInput {
  vaiControllerContract: VaiUnitroller;
  fromAccountAddress: string;
  amountWei: string;
}

export type IRepayVaiOutput = TransactionReceipt;

const repayVai = async ({
  vaiControllerContract,
  fromAccountAddress,
  amountWei,
}: IRepayVaiInput): Promise<IRepayVaiOutput> => {
  const resp = await vaiControllerContract.methods
    .repayVAI(amountWei)
    .send({ from: fromAccountAddress });
  return checkForVaiControllerTransactionError(resp);
};

export default repayVai;
