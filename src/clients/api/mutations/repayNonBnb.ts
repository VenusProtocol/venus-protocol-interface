import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core/types';

import { VTokenId } from 'types';
import { VTokenContract } from 'clients/contracts/types';

export interface IRepayNonBnbInput {
  vTokenContract: VTokenContract<Exclude<VTokenId, 'bnb'>>;
  fromAccountAddress: string;
  amountWei: BigNumber;
}

export type RepayNonBnbOutput = TransactionReceipt;

const repayNonBnb = async ({
  vTokenContract,
  fromAccountAddress,
  amountWei,
}: IRepayNonBnbInput): Promise<RepayNonBnbOutput> =>
  vTokenContract.methods.repayBorrow(amountWei.toFixed()).send({ from: fromAccountAddress });

export default repayNonBnb;
