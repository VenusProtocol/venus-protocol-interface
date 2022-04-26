import type { TransactionReceipt } from 'web3-core';
import { VaiUnitroller } from 'types/contracts';

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
}: IRepayVaiInput): Promise<IRepayVaiOutput> =>
  vaiControllerContract.methods.repayVAI(amountWei).send({ from: fromAccountAddress });

export default repayVai;
