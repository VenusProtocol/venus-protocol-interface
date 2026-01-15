export type TvlResponseData = {
  suppliedSumCents: string;
  borrowedSumCents: string;
  liquiditySumCents: string;
  marketCount: number;
  poolCount: number;
  chainCount: number;
};

export const scale = (value: string | number, decimals: number) => Number(value) / 10 ** decimals;

export const convertCentsToUsd = (value: string | number) => Number(value) / 100;

export const formatUsd = (value: number) => {
  const formattedValue = new Intl.NumberFormat('en-EN', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
  return formattedValue;
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
