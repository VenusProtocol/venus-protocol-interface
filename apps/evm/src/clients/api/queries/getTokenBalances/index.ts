import BigNumber from 'bignumber.js';

import { getTokenContract } from 'libs/contracts';
import type { Provider } from 'libs/wallet';
import type { Token, TokenBalance } from 'types';

export interface GetTokenBalancesInput {
  provider: Provider;
  accountAddress: string;
  tokens: Token[];
}

export type GetTokenBalancesOutput = {
  tokenBalances: TokenBalance[];
};

const getTokenBalances = async ({
  provider,
  accountAddress,
  tokens,
}: GetTokenBalancesInput): Promise<GetTokenBalancesOutput> => {
  const tokenBalanceResults = await Promise.allSettled(
    tokens.map(token => {
      if (token.isNative) {
        return provider.getBalance(accountAddress);
      }

      const tokenContract = getTokenContract({
        token,
        signerOrProvider: provider,
      });

      return tokenContract.balanceOf(accountAddress);
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

export default getTokenBalances;
