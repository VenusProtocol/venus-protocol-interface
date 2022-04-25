import type { TransactionReceipt } from 'web3-core';
import { Comptroller } from 'types/contracts';

export interface IEnterMarketsInput {
  comptrollerContract: Comptroller;
  accountAddress?: string;
  vtokenAddresses: string[];
}

export type EnterMarketsOutput = TransactionReceipt;

const enterMarkets = ({
  comptrollerContract,
  accountAddress,
  vtokenAddresses,
}: IEnterMarketsInput): Promise<EnterMarketsOutput> =>
  comptrollerContract.methods.enterMarkets(vtokenAddresses).send({ from: accountAddress });

export default enterMarkets;
