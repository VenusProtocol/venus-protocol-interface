import BigNumber from 'bignumber.js';
import { TokenId } from 'types';
import Web3 from 'web3';

import { getTokenContract } from 'clients/contracts';

export interface GetBalanceOfInput {
  web3: Web3;
  accountAddress: string;
  tokenId: TokenId;
}

export type GetBalanceOfOutput = {
  balanceWei: BigNumber;
};

const getBalanceOf = async ({
  web3,
  accountAddress,
  tokenId,
}: GetBalanceOfInput): Promise<GetBalanceOfOutput> => {
  let balanceWei: BigNumber;

  if (tokenId === 'bnb') {
    const resp = await web3.eth.getBalance(accountAddress);
    balanceWei = new BigNumber(resp);
  } else {
    const tokenContract = getTokenContract(tokenId, web3);
    const resp = await tokenContract.methods.balanceOf(accountAddress).call();
    balanceWei = new BigNumber(resp);
  }

  return {
    balanceWei,
  };
};

export default getBalanceOf;
