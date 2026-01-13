import { useQuery } from '@tanstack/react-query';
import FunctionKey from 'constants/functionKey';
import { fetchProposalCount } from '.';

export const useProposalsCountFromApi = () =>
  useQuery({
    queryKey: [FunctionKey.GET_PROPOSALS_COUNT_FROM_API],
    queryFn: fetchProposalCount,
  });
