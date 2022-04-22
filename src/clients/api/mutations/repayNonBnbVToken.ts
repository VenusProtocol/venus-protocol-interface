import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core/types';

import { VTokenId } from 'types';
import { VTokenContract } from 'clients/contracts/types';

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
}: IRepayNonBnbVTokenInput): Promise<RepayNonBnbVTokenOutput> =>
  vTokenContract.methods.repayBorrow(amountWei.toFixed()).send({ from: fromAccountAddress });

export default repayNonBnbVToken;
