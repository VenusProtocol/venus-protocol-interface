import BigNumber from 'bignumber.js';

import { getTokenContract } from 'libs/contracts';
import type { Provider } from 'libs/wallet';
import type { Token } from 'types';

export interface GetBalanceOfInput {
  accountAddress: string;
  token: Token;
  provider: Provider;
}

export type GetBalanceOfOutput = {
  balanceMantissa: BigNumber;
};

const getBalanceOf = async ({
  provider,
  accountAddress,
  token,
}: GetBalanceOfInput): Promise<GetBalanceOfOutput> => {
  let balanceMantissa: BigNumber;

  if (token.isNative) {
    const resp = await provider.getBalance(accountAddress);
    balanceMantissa = new BigNumber(resp.toString());
  } else {
    const tokenContract = getTokenContract({ token, signerOrProvider: provider });
    const resp = await tokenContract.balanceOf(accountAddress);
    balanceMantissa = new BigNumber(resp.toString());
  }

  return {
    balanceMantissa,
  };
};

export default getBalanceOf;
