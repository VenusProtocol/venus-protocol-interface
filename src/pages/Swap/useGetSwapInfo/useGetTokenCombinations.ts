import { Token as PSToken } from '@pancakeswap/sdk/dist/index.js';
import config from 'config';
import flatMap from 'lodash/flatMap';
import { useMemo } from 'react';
import { Token } from 'types';

import { TESTNET_PANCAKE_SWAP_TOKENS } from 'constants/tokens';

export interface UseGetTokenCombinationsInput {
  fromToken: Token;
  toToken: Token;
}

// Define tokens to check trades against
const BASE_TRADE_TOKENS = config.isOnTestnet
  ? [
      TESTNET_PANCAKE_SWAP_TOKENS.wbnb,
      TESTNET_PANCAKE_SWAP_TOKENS.busd,
      TESTNET_PANCAKE_SWAP_TOKENS.cake,
    ]
  : [
      // TODO: add mainnet tokens
    ];

const useGetTokenCombinations = ({
  fromToken,
  toToken,
}: UseGetTokenCombinationsInput): [PSToken, PSToken][] =>
  useMemo(() => {
    const psFromToken = new PSToken(
      config.chainId,
      fromToken.address,
      fromToken.decimals,
      fromToken.symbol,
    );
    const psToToken = new PSToken(
      config.chainId,
      fromToken.address,
      fromToken.decimals,
      fromToken.symbol,
    );
    // Convert tokens to PancakeSwap token instances
    const baseTradeTokens = [
      ...BASE_TRADE_TOKENS.map(
        token => new PSToken(config.chainId, token.address, token.decimals, token.symbol),
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
