import BigNumber from 'bignumber.js';
import { checkForVaiControllerTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';

import { VaiUnitroller } from 'types/contracts';

export interface MintVaiInput {
  vaiControllerContract: VaiUnitroller;
  amountWei: BigNumber;
}

export type MintVaiOutput = ContractReceipt;

const mintVai = async ({
  vaiControllerContract,
  amountWei,
}: MintVaiInput): Promise<MintVaiOutput> => {
  const transaction = await vaiControllerContract.mintVAI(amountWei.toFixed());
  const receipt = await transaction.wait(1);
  return checkForVaiControllerTransactionError(receipt);
};

export default mintVai;
