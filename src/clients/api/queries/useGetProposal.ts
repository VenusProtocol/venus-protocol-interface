import { QueryObserverOptions, useQuery } from 'react-query';
import { IProposal } from 'types';

import { queryClient } from 'clients/api';
import getProposal from 'clients/api/queries/getProposals/getProposal';
import { GetProposalOutput, IGetProposalInput } from 'clients/api/queries/getProposals/types';
import { BLOCK_TIME_MS } from 'constants/bsc';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetProposalOutput,
  Error,
  GetProposalOutput,
  GetProposalOutput,
  [FunctionKey.GET_PROPOSAL, IGetProposalInput]
>;

const refetchStates = ['Pending', 'Active', 'Succeeded', 'Queued'];

// refetchInterval is set automatically with onSucess so it is excluded from being set manually
const useGetProposal = (params: IGetProposalInput, options?: Omit<Options, 'refetchInterval'>) =>
  useQuery([FunctionKey.GET_PROPOSAL, params], () => getProposal(params), {
    onSuccess: (data: IProposal) => {
      const refetchInterval = refetchStates.includes(data.state) ? BLOCK_TIME_MS : 0;
      queryClient.setQueryDefaults([FunctionKey.GET_PROPOSAL, params], {
        refetchInterval,
      });
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    ...options,
  });

export default useGetProposal;
