import BigNumber from 'bignumber.js';
import { ContractTransaction } from 'ethers';

import { VaiController } from 'packages/contracts';

export interface MintVaiInput {
  vaiControllerContract: VaiController;
  amountMantissa: BigNumber;
}

export type MintVaiOutput = ContractTransaction;

const mintVai = async ({
  vaiControllerContract,
  amountMantissa,
}: MintVaiInput): Promise<MintVaiOutput> => vaiControllerContract.mintVAI(amountMantissa.toFixed());

export default mintVai;
