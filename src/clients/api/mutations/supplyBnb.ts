import Web3 from 'web3';
import type { TransactionReceipt } from 'web3-core';
import { VBnbToken } from 'types/contracts';
import { getVBepToken } from 'utilities';

export interface ISupplyBnbInput {
  tokenContract: VBnbToken;
  web3: Web3;
  account: string;
  amount: string;
}

const vBnbAddress = getVBepToken('bnb').address;

export type SupplyBnbOutput = TransactionReceipt;

const supplyBnb = async ({
  web3,
  tokenContract,
  account,
  amount,
}: ISupplyBnbInput): Promise<SupplyBnbOutput> => {
  const contractData = tokenContract.methods.mint().encodeABI();
  const tx = {
    from: account,
    to: vBnbAddress,
    value: amount,
    data: contractData,
  };

  return web3.eth.sendTransaction(tx);
};

export default supplyBnb;
