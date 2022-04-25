import type { TransactionReceipt } from 'web3-core';
import { Comptroller } from 'types/contracts';

export interface IExitMarketInput {
  comptrollerContract: Comptroller;
  accountAddress?: string;
  vtokenAddress: string;
}

export type ExitMarketOutput = TransactionReceipt;

const exitMarket = ({
  comptrollerContract,
  accountAddress,
  vtokenAddress,
}: IExitMarketInput): Promise<ExitMarketOutput> =>
  comptrollerContract.methods.exitMarket(vtokenAddress).send({ from: accountAddress });

export default exitMarket;
