import { useQuery } from '@tanstack/react-query';
import { fetchProposalCount } from '.';

export const useProposalsCountFromApi = () =>
  useQuery({
    queryKey: ['proposalCount'],
    queryFn: fetchProposalCount,
  });
