import { useQuery } from '@tanstack/react-query';
import FunctionKey from 'constants/functionKey';
import { fetchMarketsTvl } from '.';

export const useGetMarketsTvl = () =>
  useQuery({
    queryKey: [FunctionKey.GET_MARKETS_TVL],
    queryFn: fetchMarketsTvl,
  });
