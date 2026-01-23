import { useQuery } from '@tanstack/react-query';
import FunctionKey from 'constants/functionKey';
import { getProposalCount } from '.';

export const useGetProposalCount = () =>
  useQuery({
    queryKey: [FunctionKey.GET_PROPOSAL_COUNT],
    queryFn: getProposalCount,
  });
