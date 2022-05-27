import type { TransactionReceipt } from 'web3-core';
import { Comptroller } from 'types/contracts';
import { checkForComptrollerTransactionError } from 'errors';

export interface IEnterMarketsInput {
  comptrollerContract: Comptroller;
  accountAddress?: string;
  vtokenAddresses: string[];
}

export type EnterMarketsOutput = TransactionReceipt;

const enterMarkets = async ({
  comptrollerContract,
  accountAddress,
  vtokenAddresses,
}: IEnterMarketsInput): Promise<EnterMarketsOutput> => {
  const resp = await comptrollerContract.methods
    .enterMarkets(vtokenAddresses)
    .send({ from: accountAddress });
  return checkForComptrollerTransactionError(resp);
};

export default enterMarkets;
