import BigNumber from 'bignumber.js';
import { checkForVaiControllerTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core';

import { VaiUnitroller } from 'types/contracts';

export interface MintVaiInput {
  vaiControllerContract: VaiUnitroller;
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
