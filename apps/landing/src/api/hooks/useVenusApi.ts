import { useQuery } from '@tanstack/react-query';
import { fetchMarkets } from '../index';
import { getMarketsToRender } from '../utils';

export const useVenusApi = () => {
  const {
    data: getLegacyPoolMarketsData,
    isLoading: isGetLegacyPoolMarketsLoading,
    error: getLegacyPoolMarketsError,
    refetch,
  } = useQuery({
    queryKey: ['legacyPoolMarkets'],
    queryFn: fetchMarkets,
  });

  const topMarkets = getMarketsToRender(getLegacyPoolMarketsData);

  const legacyPool = (getLegacyPoolMarketsData ?? []).reduce(
    (acc, data) => ({
      marketSize: acc.marketSize + data.totalSupplyUsd,
      borrowedSum: acc.borrowedSum + data.totalBorrowsUsd,
      liquiditySum: acc.liquiditySum + data.liquidity,
    }),
    {
      marketSize: 0,
      borrowedSum: 0,
      liquiditySum: 0,
    },
  );

  return {
    ...legacyPool,
    topMarkets,
    isLoading: isGetLegacyPoolMarketsLoading,
    error: getLegacyPoolMarketsError,
    refetch,
  };
};
