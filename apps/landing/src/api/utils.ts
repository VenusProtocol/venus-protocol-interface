import type { Token } from '@venusprotocol/chains';
import { formatCentsToReadableValue, formatTokensToReadableValue } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';
import type { TvlResponseData } from './types';

export const scale = (value: string | number, decimals: number) => Number(value) / 10 ** decimals;

export const nFormatter = (num: number, digits = 2) => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find((i: { value: number; symbol: string }) => Math.abs(num) >= i.value);

  const formatValue = (value: number) => value.toFixed(digits).replace(rx, '$1');

  return item ? formatValue(num / item.value) + item.symbol : formatValue(num);
};

// TODO: import from @venusprotocol/tokens package once it's been created
const xvs: Token = {
  address: '0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63',
  decimals: 18,
  symbol: 'XVS',
  asset: '',
};

export function formatTvlData(apiData: TvlResponseData) {
  const totalSupplyCents = Number(apiData.suppliedSumCents.split('.', 1));
  const totalBorrowCents = Number(apiData.borrowedSumCents.split('.', 1));
  const totalLiquidityCents = Number(apiData.liquiditySumCents.split('.', 1));

  const totalXvsBuyBackTokens = new BigNumber('71252.12'); // TODO: fetch from API

  const { marketCount, chainCount } = apiData;

  return {
    totalSupplyUsd: formatCentsToReadableValue({
      value: totalSupplyCents,
    }),
    totalBorrowUsd: formatCentsToReadableValue({
      value: totalBorrowCents,
    }),
    totalLiquidityUsd: formatCentsToReadableValue({
      value: totalLiquidityCents,
    }),
    totalXvsBuyBackTokens: formatTokensToReadableValue({
      value: totalXvsBuyBackTokens,
      token: xvs,
    }),
    marketCount,
    chainCount,
  };
}
