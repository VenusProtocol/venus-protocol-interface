import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';
import Web3 from 'web3';
import type { TransactionReceipt } from 'web3-core';

import { VBEP_TOKENS } from 'constants/tokens';
import { VBnbToken } from 'types/contracts';

export interface SupplyBnbInput {
  tokenContract: VBnbToken;
  web3: Web3;
  account: string;
  amountWei: BigNumber;
}

export type SupplyBnbOutput = TransactionReceipt;

const supplyBnb = async ({
  web3,
  tokenContract,
  account,
  amountWei,
}: SupplyBnbInput): Promise<SupplyBnbOutput> => {
  const contractData = tokenContract.methods.mint().encodeABI();
  const tx = {
    from: account,
    to: VBEP_TOKENS.bnb.address,
    value: amountWei.toFixed(),
    data: contractData,
  };

  const resp = await web3.eth.sendTransaction(tx);
  return checkForTokenTransactionError(resp);
};

export default supplyBnb;
