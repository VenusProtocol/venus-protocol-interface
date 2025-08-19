import { useQuery } from '@tanstack/react-query';
import { fetchTvl } from '../index';

export const useVenusApi = () =>
  useQuery({
    queryKey: ['tvl'],
    queryFn: fetchTvl,
  });
