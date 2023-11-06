import { Token as PSToken } from '@pancakeswap/sdk/dist/index.js';
import flatMap from 'lodash/flatMap';
import { useGetSwapTokens, useGetToken } from 'packages/tokens';
import { useMemo } from 'react';
import { ChainId, PSTokenCombination, Token } from 'types';

import { useAuth } from 'context/AuthContext';

import wrapToken from './wrapToken';

export interface UseGetTokenCombinationsInput {
  fromToken: Token;
  toToken: Token;
}

// List tokens to check trades against
const baseTradeTokenSymbols = new Map([
  [ChainId.BSC_MAINNET, ['BUSD', 'ETH', 'XVS', 'WBNB']],
  [ChainId.BSC_TESTNET, ['WBNB', 'CAKE', 'BUSD', 'USDT', 'BTCB', 'ETH', 'USDC']],
]);

const useGetTokenCombinations = ({
  fromToken,
  toToken,
}: UseGetTokenCombinationsInput): PSTokenCombination[] => {
  const { chainId } = useAuth();
  const swapTokens = useGetSwapTokens();
  const wbnb = useGetToken({
    symbol: 'WBNB',
  });

  const baseTradeTokens = useMemo(
    () =>
      baseTradeTokenSymbols.has(chainId)
        ? swapTokens.filter(token =>
            (baseTradeTokenSymbols.get(chainId) || []).includes(token.symbol),
          )
        : [],
    [swapTokens, chainId],
  );

  return useMemo(() => {
    if (!wbnb) {
      return [];
    }

    const wrappedFromToken = wrapToken({ token: fromToken, wbnb });
    const wrappedToToken = wrapToken({ token: toToken, wbnb });

    const psFromToken = new PSToken(
      chainId,
      wrappedFromToken.address,
      wrappedFromToken.decimals,
      wrappedFromToken.symbol,
    );

    const psToToken = new PSToken(
      chainId,
      wrappedToToken.address,
      wrappedToToken.decimals,
      wrappedToToken.symbol,
    );

    // Convert tokens to PancakeSwap token instances
    const psBaseTradeTokens = [
      ...baseTradeTokens.map(
        token => new PSToken(chainId, token.address, token.decimals, token.symbol),
      ),
      // Add input tokens
      psFromToken,
      psToToken,
    ];

    const baseCombinations: PSTokenCombination[] = flatMap(
      psBaseTradeTokens,
      (base): PSTokenCombination[] => psBaseTradeTokens.map(otherBase => [base, otherBase]),
    );

    const allCombinations = [
      // The direct combination
      [psFromToken, psToToken],
      // fromToken against all bases
      ...psBaseTradeTokens.map((token): PSTokenCombination => [psFromToken, token]),
      // toToken against all bases
      ...psBaseTradeTokens.map((token): PSTokenCombination => [psToToken, token]),
      // Each base against all bases
      ...baseCombinations,
    ]
      // Remove invalid combinations
      .filter((tokens): tokens is PSTokenCombination => Boolean(tokens[0] && tokens[1]))
      .filter(([t0, t1]) => t0.address !== t1.address)
      // Remove duplicates
      .reduce(
        (acc, unfilteredCombination) =>
          acc.find(
            combination =>
              (combination[0].address.toLowerCase() ===
                unfilteredCombination[0].address.toLowerCase() &&
                combination[1].address.toLowerCase() ===
                  unfilteredCombination[1].address.toLowerCase()) ||
              (combination[0].address.toLowerCase() ===
                unfilteredCombination[1].address.toLowerCase() &&
                combination[1].address.toLowerCase() ===
                  unfilteredCombination[0].address.toLowerCase()),
          )
            ? acc
            : [...acc, unfilteredCombination],
        [] as PSTokenCombination[],
      );

    return allCombinations;
  }, [fromToken, toToken, chainId, baseTradeTokens, wbnb]);
};

export default useGetTokenCombinations;
