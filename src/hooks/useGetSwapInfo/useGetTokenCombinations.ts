import { Token as PSToken } from '@pancakeswap/sdk/dist/index.js';
import config from 'config';
import flatMap from 'lodash/flatMap';
import { useMemo } from 'react';
import { PSTokenCombination, Token } from 'types';

import { MAINNET_SWAP_TOKENS, TESTNET_SWAP_TOKENS } from 'constants/tokens';
import { useAuth } from 'context/AuthContext';

import wrapToken from './wrapToken';

export interface UseGetTokenCombinationsInput {
  fromToken: Token;
  toToken: Token;
}

// List tokens to check trades against
const BASE_TRADE_TOKENS = config.isOnTestnet
  ? [
      TESTNET_SWAP_TOKENS.busd,
      TESTNET_SWAP_TOKENS.eth,
      TESTNET_SWAP_TOKENS.xvs,
      TESTNET_SWAP_TOKENS.wbnb,
    ]
  : [
      MAINNET_SWAP_TOKENS.wbnb,
      MAINNET_SWAP_TOKENS.cake,
      MAINNET_SWAP_TOKENS.busd,
      MAINNET_SWAP_TOKENS.usdt,
      MAINNET_SWAP_TOKENS.btcb,
      MAINNET_SWAP_TOKENS.eth,
      MAINNET_SWAP_TOKENS.usdc,
    ];

const useGetTokenCombinations = ({
  fromToken,
  toToken,
}: UseGetTokenCombinationsInput): PSTokenCombination[] => {
  const { chainId } = useAuth();

  return useMemo(() => {
    if (!chainId) {
      return [];
    }

    const wrappedFromToken = wrapToken(fromToken);
    const wrappedToToken = wrapToken(toToken);

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
    const baseTradeTokens = [
      ...BASE_TRADE_TOKENS.map(
        token => new PSToken(chainId, token.address, token.decimals, token.symbol),
      ),
      // Add input tokens
      psFromToken,
      psToToken,
    ];

    const baseCombinations: PSTokenCombination[] = flatMap(
      baseTradeTokens,
      (base): PSTokenCombination[] => baseTradeTokens.map(otherBase => [base, otherBase]),
    );

    const allCombinations = [
      // The direct combination
      [psFromToken, psToToken],
      // fromToken against all bases
      ...baseTradeTokens.map((token): PSTokenCombination => [psFromToken, token]),
      // toToken against all bases
      ...baseTradeTokens.map((token): PSTokenCombination => [psToToken, token]),
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
  }, [fromToken, toToken, chainId]);
};

export default useGetTokenCombinations;
