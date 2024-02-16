import { CHAIN_METADATA } from '@venusprotocol/web3';
import { QueryObserverOptions, useQuery } from 'react-query';

import { queryClient } from 'clients/api';
import getProposal from 'clients/api/queries/getProposals/getProposal';
import { GetProposalInput, GetProposalOutput } from 'clients/api/queries/getProposals/types';
import FunctionKey from 'constants/functionKey';
import { governanceChain } from 'libs/wallet';
import { Proposal, ProposalState } from 'types';

export type UseGetProposalQueryKey = [FunctionKey.GET_PROPOSAL, GetProposalInput];

type Options = QueryObserverOptions<
  GetProposalOutput,
  Error,
  GetProposalOutput,
  GetProposalOutput,
  UseGetProposalQueryKey
>;

const refetchStates = [
  ProposalState.Pending,
  ProposalState.Active,
  ProposalState.Succeeded,
  ProposalState.Queued,
];

// refetchInterval is set automatically with onSuccess so it is excluded from being set manually
const useGetProposal = (params: GetProposalInput, options?: Omit<Options, 'refetchInterval'>) => {
  const { blockTimeMs } = CHAIN_METADATA[governanceChain.id];

  return useQuery([FunctionKey.GET_PROPOSAL, params], () => getProposal(params), {
    onSuccess: (data: Proposal) => {
      if (refetchStates.includes(data.state)) {
        queryClient.setQueryDefaults([FunctionKey.GET_PROPOSAL, params], {
          refetchInterval: blockTimeMs,
        });
      }

      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    ...options,
  });
};

export default useGetProposal;
