import BigNumber from 'bignumber.js';
import type { PublicClient } from 'viem';
import type { Address } from 'viem';

import { vBep20Abi } from 'libs/contracts';

export interface GetVTokenBalanceInput {
  publicClient: PublicClient;
  vTokenAddress: Address;
  accountAddress: Address;
}

export type GetVTokenBalanceOutput = {
  balanceMantissa: BigNumber;
};

export const getVTokenBalance = async ({
  publicClient,
  vTokenAddress,
  accountAddress,
}: GetVTokenBalanceInput): Promise<GetVTokenBalanceOutput> => {
  const res = await publicClient.readContract({
    address: vTokenAddress,
    abi: vBep20Abi,
    functionName: 'balanceOf',
    args: [accountAddress],
  });

  return {
    balanceMantissa: new BigNumber(res.toString()),
  };
};
