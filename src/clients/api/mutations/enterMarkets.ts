import { checkForComptrollerTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core';

import { Comptroller } from 'types/contracts';

export interface IEnterMarketsInput {
  comptrollerContract: Comptroller;
  accountAddress?: string;
  vTokenAddresses: string[];
}

export type EnterMarketsOutput = TransactionReceipt;

const enterMarkets = async ({
  comptrollerContract,
  accountAddress,
  vTokenAddresses,
}: IEnterMarketsInput): Promise<EnterMarketsOutput> => {
  const resp = await comptrollerContract.methods
    .enterMarkets(vTokenAddresses)
    .send({ from: accountAddress });
  return checkForComptrollerTransactionError(resp);
};

export default enterMarkets;
