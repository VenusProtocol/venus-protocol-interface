import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import { getToken } from '@venusprotocol/chains';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';

import type { YieldPlusPair } from './types';

export interface GetYieldPlusPairsOutput {
  pairs: YieldPlusPair[];
}

// Token pairs: [longSymbol, shortSymbol, price, change%, longLiq, shortLiq, supplyApy, borrowApy]
const MOCK_PAIRS: [string, string, string, number, string, string, number, number][] = [
  ['BTCB', 'USDT', '43250.00', -1.14, '$98.20M', '$87.44M', 3.12, 5.25],
  ['ETH', 'USDC', '2340.50', 0.88, '$75.30M', '$81.90M', 2.85, 4.67],
  ['CAKE', 'BNB', '0.0091', 3.32, '$110.85M', '$123.57M', 4.08, 4.08],
  ['BNB', 'CAKE', '312.50', 1.56, '$65.40M', '$72.10M', 3.45, 3.92],
  ['XVS', 'ETH', '0.0037', -0.45, '$12.80M', '$15.30M', 5.12, 6.35],
  ['AAVE', 'BTCB', '0.00213', 2.18, '$28.50M', '$31.20M', 2.95, 4.15],
  ['ADA', 'XVS', '0.052', -0.82, '$18.60M', '$21.40M', 3.68, 4.52],
  ['UNI', 'AAVE', '0.069', 1.92, '$22.10M', '$25.80M', 3.22, 4.88],
  ['DOGE', 'ADA', '0.35', 0.65, '$15.20M', '$18.40M', 2.75, 3.85],
  ['MATIC', 'UNI', '0.12', -1.33, '$9.80M', '$11.50M', 3.15, 4.22],
];

const getYieldPlusPairs = (chainId: ChainId): GetYieldPlusPairsOutput => {
  const pairs: YieldPlusPair[] = [];

  for (const [longSym, shortSym, price, change, longLiq, shortLiq, sApy, bApy] of MOCK_PAIRS) {
    const longToken = getToken({ chainId, symbol: longSym });
    const shortToken = getToken({ chainId, symbol: shortSym });

    // Only include pairs where both tokens exist on the current chain
    if (longToken && shortToken) {
      pairs.push({
        longToken,
        shortToken,
        price,
        priceChange24h: change,
        longLiquidity: longLiq,
        shortLiquidity: shortLiq,
        supplyApy: sApy,
        borrowApy: bApy,
      });
    }
  }

  return { pairs };
};

type UseGetYieldPlusPairsQueryKey = [FunctionKey.GET_YIELD_PLUS_PAIRS, { chainId: ChainId }];

type Options = QueryObserverOptions<
  GetYieldPlusPairsOutput,
  Error,
  GetYieldPlusPairsOutput,
  GetYieldPlusPairsOutput,
  UseGetYieldPlusPairsQueryKey
>;

export const useGetYieldPlusPairs = (options?: Partial<Options>) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [FunctionKey.GET_YIELD_PLUS_PAIRS, { chainId }],
    queryFn: () => getYieldPlusPairs(chainId),
    ...options,
  });
};
