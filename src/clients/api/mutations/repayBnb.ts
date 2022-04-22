import Web3 from 'web3';
import type { TransactionReceipt } from 'web3-core/types';
import BigNumber from 'bignumber.js';

import { getVBepToken } from 'utilities';
import { getVTokenContract } from 'clients/contracts';

export interface IRepayBnbInput {
  web3: Web3;
  fromAccountAddress: string;
  amountWei: BigNumber;
}

export type RepayBnbOutput = TransactionReceipt;

const repayBnb = async ({
  web3,
  fromAccountAddress,
  amountWei,
}: IRepayBnbInput): Promise<RepayBnbOutput> => {
  const vBnbContract = getVTokenContract('bnb', web3);
  const contractData = vBnbContract.methods.repayBorrow().encodeABI();

  return web3.eth.sendTransaction({
    from: fromAccountAddress,
    to: getVBepToken('bnb').address,
    value: amountWei.toFixed(),
    data: contractData,
  });
};

export default repayBnb;
