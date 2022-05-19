import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core/types';

import { VTokenId } from 'types';
import { VTokenContract } from 'clients/contracts/types';
import { checkForTransactionError } from 'utilities/errors';

export interface IRepayNonBnbVTokenInput {
  vTokenContract: VTokenContract<Exclude<VTokenId, 'bnb'>>;
  fromAccountAddress: string;
  amountWei: BigNumber;
}

export type RepayNonBnbVTokenOutput = TransactionReceipt;

const repayNonBnbVToken = async ({
  vTokenContract,
  fromAccountAddress,
  amountWei,
}: IRepayNonBnbVTokenInput): Promise<RepayNonBnbVTokenOutput> => {
  const resp = await vTokenContract.methods
    .repayBorrow(amountWei.toFixed())
    .send({ from: fromAccountAddress });
  return checkForTransactionError(resp);
};

export default repayNonBnbVToken;
