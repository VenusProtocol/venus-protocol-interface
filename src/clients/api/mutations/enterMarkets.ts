import type { TransactionReceipt } from 'web3-core';
import { Comptroller } from 'types/contracts';

export interface IEnterMarketsInput {
  comptrollerContract: Comptroller;
  account: string;
  vtokenAddresses: string[];
}

export type EnterMarketsOutput = TransactionReceipt;

const enterMarkets = ({
  comptrollerContract,
  account,
  vtokenAddresses,
}: IEnterMarketsInput): Promise<EnterMarketsOutput> =>
  comptrollerContract.methods.enterMarkets(vtokenAddresses).send({ from: account });

export default enterMarkets;
