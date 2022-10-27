import { Token as PSToken } from '@pancakeswap/sdk/dist/index.js';
import flatMap from 'lodash/flatMap';
import { useMemo } from 'react';
import { Token } from 'types';

import tokenList from '../tokenList';

export interface UseGetTokenCombinationsInput {
  fromToken: Token;
  toToken: Token;
}

// Define tokens to check trades against
// TODO: move to global file/handle better (see https://jira.toolsfdg.net/browse/VEN-712)
// TODO: handle mainnet
const BASE_TRADE_TOKENS = [tokenList.wbnb, tokenList.busd, tokenList.cake];

const useGetTokenCombinations = ({
  fromToken,
  toToken,
}: UseGetTokenCombinationsInput): [PSToken, PSToken][] =>
  useMemo(() => {
    // TODO: handle mainnet
    const psFromToken = new PSToken(97, fromToken.address, fromToken.decimals, fromToken.symbol);
    // TODO: handle mainnet
    const psToToken = new PSToken(97, fromToken.address, fromToken.decimals, fromToken.symbol);
    // Convert tokens to PancakeSwap token instances
    const baseTradeTokens = [
      ...BASE_TRADE_TOKENS.map(
        // TODO: handle mainnet
        token => new PSToken(97, token.address, token.decimals, token.symbol),
      ),
      // Add input tokens
      psFromToken,
      psToToken,
    ];

    const baseCombinations: [PSToken, PSToken][] = flatMap(
      baseTradeTokens,
      (base): [PSToken, PSToken][] => baseTradeTokens.map(otherBase => [base, otherBase]),
    );

    const allCombinations = [
      // The direct combination
      [psFromToken, psToToken],
      // fromToken against all bases
      ...baseTradeTokens.map((token): [PSToken, PSToken] => [psFromToken, token]),
      // toToken against all bases
      ...baseTradeTokens.map((token): [PSToken, PSToken] => [psToToken, token]),
      // Each base against all bases
      ...baseCombinations,
    ]
      // Remove invalid combinations
      .filter((tokens): tokens is [PSToken, PSToken] => Boolean(tokens[0] && tokens[1]))
      .filter(([t0, t1]) => t0.address !== t1.address)
      // Remove duplicates
      .reduce(
        (acc, unfilteredCombination) =>
          acc.find(
            combination =>
              combination[0].address === unfilteredCombination[0].address &&
              combination[1].address === unfilteredCombination[1].address,
          )
            ? acc
            : [...acc, unfilteredCombination],
        [] as [PSToken, PSToken][],
      );

    return allCombinations;
  }, [fromToken, toToken]);

export default useGetTokenCombinations;
