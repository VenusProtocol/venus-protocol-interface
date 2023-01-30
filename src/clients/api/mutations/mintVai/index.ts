import BigNumber from 'bignumber.js';
import { checkForVaiControllerTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core';

import { VaiController } from 'types/contracts';

export interface MintVaiInput {
  vaiControllerContract: VaiController;
  fromAccountAddress: string;
  amountWei: BigNumber;
}

export type MintVaiOutput = TransactionReceipt;

const mintVai = async ({
  vaiControllerContract,
  fromAccountAddress,
  amountWei,
}: MintVaiInput): Promise<MintVaiOutput> => {
  const resp = await vaiControllerContract.methods
    .mintVAI(amountWei.toFixed())
    .send({ from: fromAccountAddress });
  return checkForVaiControllerTransactionError(resp);
};

export default mintVai;
