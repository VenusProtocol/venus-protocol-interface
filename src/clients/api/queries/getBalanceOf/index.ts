import BigNumber from 'bignumber.js';
import { Token } from 'types';
import Web3 from 'web3';

import { getTokenContract } from 'clients/contracts';

export interface GetBalanceOfInput {
  web3: Web3;
  accountAddress: string;
  token: Token;
}

export type GetBalanceOfOutput = {
  balanceWei: BigNumber;
};

const getBalanceOf = async ({
  web3,
  accountAddress,
  token,
}: GetBalanceOfInput): Promise<GetBalanceOfOutput> => {
  let balanceWei: BigNumber;

  if (token.isNative) {
    const resp = await web3.eth.getBalance(accountAddress);
    balanceWei = new BigNumber(resp);
  } else {
    const tokenContract = getTokenContract(token, web3);
    const resp = await tokenContract.methods.balanceOf(accountAddress).call();
    balanceWei = new BigNumber(resp);
  }

  return {
    balanceWei,
  };
};

export default getBalanceOf;
