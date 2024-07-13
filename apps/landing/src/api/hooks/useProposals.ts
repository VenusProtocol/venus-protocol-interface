import { useQuery } from '@tanstack/react-query';
import { fetchProposalCount } from '../index';

export const useProposalsCountFromApi = () =>
  useQuery({
    queryKey: ['proposalCount'],
    queryFn: fetchProposalCount,
  });
