import { useQuery } from '@tanstack/react-query';
import { fetchMarkets, fetchTvl } from './';
import { getMarketsToRender } from './utils';

export const useGetMarketsAndTvl = () => {
  const {
    data: getLegacyPoolMarketsData,
    isLoading: isGetLegacyPoolMarketsLoading,
    error: getLegacyPoolMarketsError,
    refetch: refetchMarkets,
  } = useQuery({
    queryKey: ['legacyPoolMarkets'],
    queryFn: fetchMarkets,
  });

  const {
    data: getTvlData,
    isLoading: isGetTvlDataLoading,
    error: getTvlDataError,
    refetch: refetchTvl,
  } = useQuery({
    queryKey: ['tvl'],
    queryFn: fetchTvl,
  });

  const topMarkets = getMarketsToRender(getLegacyPoolMarketsData);

  return {
    ...getTvlData,
    topMarkets,
    isLoading: isGetLegacyPoolMarketsLoading || isGetTvlDataLoading,
    errors: { getLegacyPoolMarketsError, getTvlDataError },
    refetch: () => {
      refetchMarkets();
      refetchTvl();
    },
  };
};
