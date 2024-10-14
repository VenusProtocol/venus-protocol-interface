import {
  bscMainnetVCanAddress,
  compoundDecimals,
  tokenIconUrls,
  vTokenDecimals,
} from './constants';
import type { MarketMapped, MarketResponse, TvlResponseData } from './types';

export const scale = (value: string | number, decimals: number) => Number(value) / 10 ** decimals;

export const convertCentsToUsd = (value: string | number) => Number(value) / 100;

export const mapMarketsData = (markets?: MarketResponse[]): MarketMapped[] => {
  if (!markets) return [];

  return markets.reduce<MarketMapped[]>((acc, i) => {
    // Hotfix to filter out vCAN token
    if (i.address === bscMainnetVCanAddress) {
      return acc;
    }

    const underlyingIconUrl = tokenIconUrls[i.underlyingSymbol as keyof typeof tokenIconUrls];

    const tokenPriceUsd = convertCentsToUsd(i.tokenPriceCents);
    const totalBorrowsTokens = scale(i.totalBorrowsMantissa, i.underlyingDecimal);

    const totalSupplyVTokens = scale(i.totalSupplyMantissa, vTokenDecimals);
    const exchangeRateVTokens =
      Number(i.exchangeRateMantissa) === 0
        ? 0
        : 1 /
          scale(i.exchangeRateMantissa, compoundDecimals + i.underlyingDecimal - vTokenDecimals);

    const totalSupplyTokens = totalSupplyVTokens / exchangeRateVTokens;

    const formattedMarket: MarketMapped = {
      ...i,
      supplyApy: Number(i.supplyApy),
      supplyXvsApy: Number(i.supplyXvsApy),
      totalSupplyUsd: totalSupplyTokens * tokenPriceUsd,
      totalBorrowsUsd: totalBorrowsTokens * tokenPriceUsd,
      liquidity: convertCentsToUsd(i.liquidityCents),
      depositApy: Number(i.supplyApy) + Number(i.supplyXvsApy),
      borrowApy: Number(i.borrowApy) - Number(i.borrowXvsApy),
      underlyingIconUrl,
    };

    return acc.concat(formattedMarket);
  }, []);
};

function sortByTotalSupplyUsd(a: MarketMapped, b: MarketMapped) {
  return b.totalSupplyUsd - a.totalSupplyUsd;
}

function sortBySupplyApy(a: MarketMapped, b: MarketMapped) {
  return b.supplyApy - a.supplyApy;
}

export const getMarketsToRender = (markets?: MarketMapped[]) => {
  if (!markets) return [];
  // first we get all markets sorted by their size/supply in USD
  const sortedMarkets = markets.sort(sortByTotalSupplyUsd);
  // then we list the top 5 markets, ordered by their supply APY (higher APYs first)
  return sortedMarkets.slice(0, 5).sort(sortBySupplyApy);
};

export const formatUsd = (value: number) => {
  const formattedValue = new Intl.NumberFormat('en-EN', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
  return formattedValue;
};

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

export function formatTvlData(apiData: TvlResponseData) {
  const totalSupplyCents = Number(apiData.suppliedSumCents.split('.', 1));
  const totalBorrowCents = Number(apiData.borrowedSumCents.split('.', 1));
  const totalLiquidityCents = Number(apiData.liquiditySumCents.split('.', 1));
  const { marketCount, chainCount } = apiData;

  return {
    totalSupplyUsd: formatUsd(convertCentsToUsd(totalSupplyCents)),
    totalBorrowUsd: formatUsd(convertCentsToUsd(totalBorrowCents)),
    totalLiquidityUsd: formatUsd(convertCentsToUsd(totalLiquidityCents)),
    marketCount,
    chainCount,
  };
}
