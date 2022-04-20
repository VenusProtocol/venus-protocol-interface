import type { TransactionReceipt } from 'web3-core';
import { VBep20 } from 'types/contracts';

export interface ISupplyInput {
  tokenContract: VBep20;
  account: string | undefined;
  amount: string;
}

export type SupplyOutput = void | TransactionReceipt;

const supply = async ({ tokenContract, account, amount }: ISupplyInput): Promise<SupplyOutput> =>
  tokenContract.methods.mint(amount).send({ from: account });

export default supply;
