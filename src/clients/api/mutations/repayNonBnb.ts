import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core/types';

import { VBep20 } from 'types/contracts';

export interface IRepayNonBnbInput {
  vTokenContract: VBep20;
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
