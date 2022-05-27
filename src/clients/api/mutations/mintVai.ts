import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core';
import { VaiUnitroller } from 'types/contracts';
import { checkForVaiControllerTransactionError } from 'errors';

export interface IMintVaiInput {
  vaiControllerContract: VaiUnitroller;
  fromAccountAddress: string;
  amountWei: BigNumber;
}

export type MintVaiOutput = TransactionReceipt;

const mintVai = async ({
  vaiControllerContract,
  fromAccountAddress,
  amountWei,
}: IMintVaiInput): Promise<MintVaiOutput> => {
  const resp = await vaiControllerContract.methods
    .mintVAI(amountWei.toFixed())
    .send({ from: fromAccountAddress });
  return checkForVaiControllerTransactionError(resp);
};

export default mintVai;
