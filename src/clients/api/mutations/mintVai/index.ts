import BigNumber from 'bignumber.js';
import { ContractTransaction } from 'ethers';
import { VaiController } from 'packages/contracts';

export interface MintVaiInput {
  vaiControllerContract: VaiController;
  amountWei: BigNumber;
}

export type MintVaiOutput = ContractTransaction;

const mintVai = async ({
  vaiControllerContract,
  amountWei,
}: MintVaiInput): Promise<MintVaiOutput> => vaiControllerContract.mintVAI(amountWei.toFixed());

export default mintVai;
