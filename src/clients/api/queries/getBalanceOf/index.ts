import type { Provider } from '@wagmi/core';
import BigNumber from 'bignumber.js';
import { Token } from 'types';

import { getTokenContract } from 'clients/contracts';

export interface GetBalanceOfInput {
  accountAddress: string;
  token: Token;
  provider: Provider;
}

export type GetBalanceOfOutput = {
  balanceWei: BigNumber;
};

const getBalanceOf = async ({
  provider,
  accountAddress,
  token,
}: GetBalanceOfInput): Promise<GetBalanceOfOutput> => {
  let balanceWei: BigNumber;

  if (token.isNative) {
    const resp = await provider.getBalance(accountAddress);
    balanceWei = new BigNumber(resp.toString());
  } else {
    const tokenContract = getTokenContract(token);
    const resp = await tokenContract.balanceOf(accountAddress);
    balanceWei = new BigNumber(resp.toString());
  }

  return {
    balanceWei,
  };
};

export default getBalanceOf;
