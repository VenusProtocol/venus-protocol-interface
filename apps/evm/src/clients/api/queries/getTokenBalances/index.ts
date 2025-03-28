import BigNumber from 'bignumber.js';
import { bep20Abi } from 'libs/contracts';
import type { Token, TokenBalance } from 'types';
import type { Address, PublicClient } from 'viem';

export interface GetTokenBalancesInput {
  publicClient: PublicClient;
  accountAddress: Address;
  tokens: Token[];
}

export type GetTokenBalancesOutput = {
  tokenBalances: TokenBalance[];
};

export const getTokenBalances = async ({
  publicClient,
  accountAddress,
  tokens,
}: GetTokenBalancesInput): Promise<GetTokenBalancesOutput> => {
  const tokenBalanceResults = await Promise.allSettled(
    tokens.map(token => {
      if (token.isNative) {
        return publicClient.getBalance({
          address: accountAddress,
        });
      }

      return publicClient.readContract({
        abi: bep20Abi,
        address: token.address,
        functionName: 'balanceOf',
        args: [accountAddress],
      });
    }, []),
  );

  const tokenBalances = tokenBalanceResults.reduce<TokenBalance[]>(
    (acc, tokenBalanceResult, index) => {
      const balanceMantissa =
        tokenBalanceResult.status === 'fulfilled'
          ? new BigNumber(tokenBalanceResult.value.toString())
          : undefined;

      if (!balanceMantissa) {
        return acc;
      }

      const tokenBalance: TokenBalance = {
        token: tokens[index],
        balanceMantissa,
      };

      return [...acc, tokenBalance];
    },
    [],
  );

  return { tokenBalances };
};
