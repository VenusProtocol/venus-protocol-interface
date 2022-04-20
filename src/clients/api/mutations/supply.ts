import type { TransactionReceipt } from 'web3-core';
import { Bep20 } from 'types/contracts';

export interface ISupplyInput {
  tokenContract: Bep20;
  account: string | undefined;
  amount: string;
}

export type SupplyOutput = void | TransactionReceipt;

const supply = async ({ tokenContract, account, amount }: ISupplyInput): Promise<SupplyOutput> =>
  tokenContract.methods.mint(amount).send({ from: account || undefined });

export default supply;
