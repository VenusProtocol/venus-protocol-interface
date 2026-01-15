import { useQuery } from '@tanstack/react-query';
import FunctionKey from 'constants/functionKey';
import { fetchProposalCount } from '.';

export const useProposalsCount = () =>
  useQuery({
    queryKey: [FunctionKey.GET_PROPOSALS_COUNT],
    queryFn: fetchProposalCount,
  });
