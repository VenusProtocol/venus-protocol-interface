import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';

import type { OhlcvCandle } from './types';

export interface GetYieldPlusPairPriceInput {
  longTokenSymbol: string;
  shortTokenSymbol: string;
}

export interface GetYieldPlusPairPriceOutput {
  candles: OhlcvCandle[];
}

const generateDailyCandles = (basePrice: number, days: number): OhlcvCandle[] => {
  const candles: OhlcvCandle[] = [];
  let price = basePrice;

  // Start from `days` ago
  const now = Math.floor(Date.now() / 1000);
  const daySeconds = 86400;
  const startTime = now - days * daySeconds;

  for (let i = 0; i < days; i++) {
    const volatility = price * 0.03;
    const change = (Math.random() - 0.48) * volatility * 2;
    const open = price;
    const close = Math.max(open + change, open * 0.5);
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.max(Math.min(open, close) - Math.random() * volatility * 0.5, open * 0.3);
    const volume = Math.floor(10000 + Math.random() * 90000);

    candles.push({
      time: startTime + i * daySeconds,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });

    price = close;
  }

  return candles;
};

const getYieldPlusPairPrice = (
  input: GetYieldPlusPairPriceInput,
): GetYieldPlusPairPriceOutput => {
  const pairKey = `${input.longTokenSymbol}/${input.shortTokenSymbol}`.toUpperCase();

  const basePrices: Record<string, number> = {
    'BTCB/USDT': 43250,
    'ETH/USDC': 2340,
    'CAKE/BNB': 4.8,
    'BNB/CAKE': 312,
    'XVS/ETH': 3.7,
    'AAVE/BTCB': 92,
    'ADA/XVS': 0.45,
    'UNI/AAVE': 6.35,
    'DOGE/ADA': 0.35,
    'MATIC/UNI': 0.72,
  };

  const basePrice = basePrices[pairKey] ?? 100;
  const candles = generateDailyCandles(basePrice, 90);

  return { candles };
};

type UseGetYieldPlusPairPriceQueryKey = [
  FunctionKey.GET_YIELD_PLUS_PAIR_PRICE,
  { chainId: ChainId; longTokenSymbol: string; shortTokenSymbol: string },
];

type Options = QueryObserverOptions<
  GetYieldPlusPairPriceOutput,
  Error,
  GetYieldPlusPairPriceOutput,
  GetYieldPlusPairPriceOutput,
  UseGetYieldPlusPairPriceQueryKey
>;

export const useGetYieldPlusPairPrice = (
  input: GetYieldPlusPairPriceInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [
      FunctionKey.GET_YIELD_PLUS_PAIR_PRICE,
      {
        chainId,
        longTokenSymbol: input.longTokenSymbol,
        shortTokenSymbol: input.shortTokenSymbol,
      },
    ],
    queryFn: () => getYieldPlusPairPrice(input),
    ...options,
  });
};
