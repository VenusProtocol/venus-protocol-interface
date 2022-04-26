import type { TransactionReceipt } from 'web3-core';
import { Comptroller } from 'types/contracts';

export interface IExitMarketInput {
  comptrollerContract: Comptroller;
  account: string;
  vtokenAddress: string;
}

export type ExitMarketOutput = TransactionReceipt;

const exitMarket = ({
  comptrollerContract,
  account,
  vtokenAddress,
}: IExitMarketInput): Promise<ExitMarketOutput> =>
  comptrollerContract.methods.exitMarket(vtokenAddress).send({ from: account });

export default exitMarket;
