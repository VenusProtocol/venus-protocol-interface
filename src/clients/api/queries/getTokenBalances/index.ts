import type { Provider } from '@wagmi/core';
import BigNumber from 'bignumber.js';
import { ContractCallContext, ContractCallReturnContext, Multicall } from 'ethereum-multicall';
import { contractInfos } from 'packages/contracts';
import { Token, TokenBalance } from 'types';

import { TOKENS } from 'constants/tokens';

import getBalanceOf from '../getBalanceOf';

export interface GetTokenBalancesInput {
  multicall: Multicall;
  provider: Provider;
  accountAddress: string;
  tokens: Token[];
}

type GetTokenBalancesPromise = () => Promise<TokenBalance[]>;

export type GetTokenBalancesOutput = {
  tokenBalances: TokenBalance[];
};

const getTokenBalances = async ({
  multicall,
  provider,
  accountAddress,
  tokens,
}: GetTokenBalancesInput): Promise<GetTokenBalancesOutput> => {
  let nativeTokenToRequest: Token | undefined;

  // Generate call context
  const contractCallContexts = tokens.reduce((acc, token) => {
    if (token.isNative) {
      nativeTokenToRequest = token;
      return acc;
    }

    const contractCallContext: ContractCallContext = {
      reference: token.address,
      contractAddress: token.address,
      abi: contractInfos.bep20.abi,
      calls: [
        {
          reference: 'balanceOf',
          methodName: 'balanceOf',
          methodParameters: [accountAddress],
        },
      ],
    };

    return [...acc, contractCallContext];
  }, [] as ContractCallContext[]);

  // Handle fetching non-native token balances
  const getBep20Balances: GetTokenBalancesPromise = async () => {
    const unformattedResults = await multicall.call(contractCallContexts);
    const results: ContractCallReturnContext[] = Object.values(unformattedResults.results);

    return results.reduce((acc, result) => {
      const token = tokens.find(
        inputToken => result.originalContractCallContext.reference === inputToken.address,
      );

      const returnContext = result.callsReturnContext[0];

      // Remove results for which a token could not be find in the input and for
      // which the requests was unsuccessful
      if (!token || !returnContext.success) {
        return acc;
      }

      const tokenBalance: TokenBalance = {
        token,
        balanceWei: new BigNumber(returnContext.returnValues[0].hex),
      };

      return [...acc, tokenBalance];
    }, [] as TokenBalance[]);
  };

  const promises: Promise<TokenBalance[]>[] = [getBep20Balances()];

  // Handle fetching BNB balance if it was requested
  if (nativeTokenToRequest) {
    const getNativeBalance: GetTokenBalancesPromise = async () => {
      const { balanceWei } = await getBalanceOf({ provider, accountAddress, token: TOKENS.bnb });

      return [
        {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          token: nativeTokenToRequest!,
          balanceWei,
        },
      ];
    };

    promises.push(getNativeBalance());
  }

  const res = await Promise.all(promises);

  return {
    tokenBalances: res.flat(),
  };
};

export default getTokenBalances;
