import { useQuery } from '@tanstack/react-query';
import { getProposalCount } from '../index';

export const useProposalsCountFromApi = () =>
  useQuery({
    queryKey: ['proposalCount'],
    queryFn: getProposalCount,
  });
