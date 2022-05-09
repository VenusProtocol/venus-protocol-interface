import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core';
import { VBep20 } from 'types/contracts';

export interface ISupplyNonBnbInput {
  tokenContract: VBep20;
  account: string;
  amountWei: BigNumber;
}

export type SupplyNonBnbOutput = TransactionReceipt;

const supplyNonBnb = async ({
  tokenContract,
  account,
  amountWei,
}: ISupplyNonBnbInput): Promise<SupplyNonBnbOutput> =>
  tokenContract.methods.mint(amountWei.toFixed()).send({ from: account });

export default supplyNonBnb;
