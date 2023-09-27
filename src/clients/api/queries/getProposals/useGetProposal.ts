import { QueryObserverOptions, useQuery } from 'react-query';
import { Proposal } from 'types';

import { queryClient } from 'clients/api';
import getProposal from 'clients/api/queries/getProposals/getProposal';
import { GetProposalInput, GetProposalOutput } from 'clients/api/queries/getProposals/types';
import { BLOCK_TIME_MS } from 'constants/bsc';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetProposalOutput,
  Error,
  GetProposalOutput,
  GetProposalOutput,
  [FunctionKey.GET_PROPOSAL, GetProposalInput]
>;

const refetchStates = ['Pending', 'Active', 'Succeeded', 'Queued'];

// refetchInterval is set automatically with onSuccess so it is excluded from being set manually
const useGetProposal = (params: GetProposalInput, options?: Omit<Options, 'refetchInterval'>) =>
  useQuery([FunctionKey.GET_PROPOSAL, params], () => getProposal(params), {
    onSuccess: (data: Proposal) => {
      if (refetchStates.includes(data.state)) {
        queryClient.setQueryDefaults([FunctionKey.GET_PROPOSAL, params], {
          refetchInterval: BLOCK_TIME_MS,
        });
      }

      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    ...options,
  });

export default useGetProposal;
