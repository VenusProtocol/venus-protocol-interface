import BigNumber from 'bignumber.js';
import type { Address, PublicClient } from 'viem';

import { bep20Abi } from 'libs/contracts';
import type { Token } from 'types';

export interface GetBalanceOfInput {
  accountAddress: Address;
  token: Token;
  publicClient: PublicClient;
}

export type GetBalanceOfOutput = {
  balanceMantissa: BigNumber;
};

const getBalanceOf = async ({
  publicClient,
  accountAddress,
  token,
}: GetBalanceOfInput): Promise<GetBalanceOfOutput> => {
  let balanceMantissa: BigNumber;

  if (token.isNative) {
    const resp = await publicClient.getBalance({ address: accountAddress });
    balanceMantissa = new BigNumber(resp.toString());
  } else {
    const resp = await publicClient.readContract({
      abi: bep20Abi,
      address: token.address,
      functionName: 'balanceOf',
      args: [accountAddress],
    });
    balanceMantissa = new BigNumber(resp.toString());
  }

  return {
    balanceMantissa,
  };
};

export default getBalanceOf;
