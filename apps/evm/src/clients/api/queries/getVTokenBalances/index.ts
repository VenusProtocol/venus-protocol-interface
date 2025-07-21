import BigNumber from 'bignumber.js';
import { vBep20Abi } from 'libs/contracts';
import type { VToken, VTokenBalance } from 'types';
import type { Address, PublicClient } from 'viem';

export interface GetVTokenBalancesInput {
  publicClient: PublicClient;
  accountAddress: Address;
  vTokens: VToken[];
}

export type GetVTokenBalancesOutput = {
  vTokenBalances: VTokenBalance[];
};

export const getVTokenBalances = async ({
  publicClient,
  accountAddress,
  vTokens,
}: GetVTokenBalancesInput): Promise<GetVTokenBalancesOutput> => {
  // @ts-expect-error The type becomes too deep for TS, but it is correct
  const vTokenBalanceResults = await publicClient.multicall({
    contracts: vTokens.map(vToken => ({
      abi: vBep20Abi,
      address: vToken.address,
      functionName: 'balanceOf',
      args: [accountAddress],
    })),
  });

  const vTokenBalances = vTokenBalanceResults.reduce<VTokenBalance[]>(
    (acc, vTokenBalanceResult, index) => {
      const balanceMantissa =
        vTokenBalanceResult.status === 'success'
          ? new BigNumber(vTokenBalanceResult.result.toString())
          : undefined;

      if (!balanceMantissa) {
        return acc;
      }

      const tokenBalance: VTokenBalance = {
        vToken: vTokens[index],
        balanceMantissa,
      };

      return [...acc, tokenBalance];
    },
    [],
  );

  return { vTokenBalances };
};
