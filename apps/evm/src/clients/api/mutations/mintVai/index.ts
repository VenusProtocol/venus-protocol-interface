import type BigNumber from 'bignumber.js';
import type { ContractTransaction } from 'ethers';

import type { VaiController } from 'libs/contracts';

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
