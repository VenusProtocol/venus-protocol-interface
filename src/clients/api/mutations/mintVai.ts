import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core';
import { VaiUnitroller } from 'types/contracts';

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
}: IMintVaiInput): Promise<MintVaiOutput> =>
  vaiControllerContract.methods.mintVAI(amountWei.toFixed()).send({ from: fromAccountAddress });

export default mintVai;
