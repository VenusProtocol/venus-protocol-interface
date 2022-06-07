import type { TransactionReceipt } from 'web3-core';
import { Comptroller } from 'types/contracts';
import { checkForComptrollerTransactionError } from 'errors';

export interface IExitMarketInput {
  comptrollerContract: Comptroller;
  accountAddress?: string;
  vtokenAddress: string;
}

export type ExitMarketOutput = TransactionReceipt;

const exitMarket = async ({
  comptrollerContract,
  accountAddress,
  vtokenAddress,
}: IExitMarketInput): Promise<ExitMarketOutput> => {
  const resp = await comptrollerContract.methods
    .exitMarket(vtokenAddress)
    .send({ from: accountAddress });
  return checkForComptrollerTransactionError(resp);
};

export default exitMarket;
