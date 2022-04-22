import type { TransactionReceipt } from 'web3-core';
import { VBep20 } from 'types/contracts';

export interface ISupplyNonBnbInput {
  tokenContract: VBep20;
  account: string;
  amount: string;
}

export type SupplyNonBnbOutput = void | TransactionReceipt;

const supplyNonBnb = async ({
  tokenContract,
  account,
  amount,
}: ISupplyNonBnbInput): Promise<SupplyNonBnbOutput> =>
  tokenContract.methods.mint(amount).send({ from: account });

export default supplyNonBnb;
