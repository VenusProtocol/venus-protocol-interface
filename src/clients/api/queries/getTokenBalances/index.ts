import BigNumber from 'bignumber.js';
import { Bep20 } from 'packages/contracts';
import { Token, TokenBalance } from 'types';
import { getTokenContract } from 'utilities';

import { type Provider } from 'clients/web3';

export interface GetTokenBalancesInput {
  provider: Provider;
  accountAddress: string;
  tokens: Token[];
}

export type GetTokenBalancesOutput = {
  tokenBalances: TokenBalance[];
};

Array<Awaited<ReturnType<Bep20['balanceOf']>> | Awaited<ReturnType<Provider['getBalance']>>>;

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
      const balanceWei =
        tokenBalanceResult.status === 'fulfilled'
          ? new BigNumber(tokenBalanceResult.value.toString())
          : undefined;

      if (!balanceWei) {
        return acc;
      }

      const tokenBalance: TokenBalance = {
        token: tokens[index],
        balanceWei,
      };

      return [...acc, tokenBalance];
    },
    [],
  );

  return { tokenBalances };
};

export default getTokenBalances;
