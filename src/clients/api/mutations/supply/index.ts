import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';
import { VToken } from 'types';
import Web3 from 'web3';
import type { TransactionReceipt } from 'web3-core';

import { getVTokenContract } from 'clients/contracts';
import { VBEP_TOKENS } from 'constants/tokens';
import { VBep20, VBnbToken } from 'types/contracts';

export interface SupplyInput {
  vToken: VToken;
  web3: Web3;
  accountAddress: string;
  amountWei: BigNumber;
}

export type SupplyOutput = TransactionReceipt;

const supply = async ({
  web3,
  vToken,
  accountAddress,
  amountWei,
}: SupplyInput): Promise<SupplyOutput> => {
  // Handle supplying BNB
  if (vToken.symbol === 'vBNB') {
    const tokenContract = getVTokenContract(vToken, web3) as VBnbToken;
    const contractData = tokenContract.methods.mint().encodeABI();
    const tx = {
      from: accountAddress,
      to: VBEP_TOKENS.bnb.address,
      value: amountWei.toFixed(),
      data: contractData,
    };
    const resp = await web3.eth.sendTransaction(tx);

    return checkForTokenTransactionError(resp);
  }

  // Handle supplying tokens other that BNB
  const tokenContract = getVTokenContract(vToken, web3) as VBep20;
  const resp = await tokenContract.methods.mint(amountWei.toFixed()).send({ from: accountAddress });

  return checkForTokenTransactionError(resp);
};

export default supply;
