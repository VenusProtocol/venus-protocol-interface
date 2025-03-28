import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { getGovernorBravoDelegateContractAddress } from 'libs/contracts';
import { governanceChain, usePublicClient } from 'libs/wallet';
import { callOrThrow } from 'utilities';
import type { Address } from 'viem';
import {
  type GetLatestProposalIdByProposerInput,
  type GetLatestProposalIdByProposerOutput,
  getLatestProposalIdByProposer,
} from '.';

type TrimmedGetLatestProposalIdByProposerInput = Omit<
  GetLatestProposalIdByProposerInput,
  'governorBravoDelegateContractAddress' | 'publicClient'
>;

type Options = QueryObserverOptions<
  GetLatestProposalIdByProposerOutput,
  Error,
  GetLatestProposalIdByProposerOutput,
  GetLatestProposalIdByProposerOutput,
  [FunctionKey.GET_LATEST_PROPOSAL_ID_BY_PROPOSER, Address]
>;

const governorBravoDelegateContractAddress = getGovernorBravoDelegateContractAddress({
  chainId: governanceChain.id,
});

export const useGetLatestProposalIdByProposer = (
  { accountAddress }: TrimmedGetLatestProposalIdByProposerInput,
  options?: Partial<Options>,
) => {
  const { blockTimeMs } = useGetChainMetadata();
  const { publicClient } = usePublicClient({
    chainId: governanceChain.id,
  });

  return useQuery({
    queryKey: [FunctionKey.GET_LATEST_PROPOSAL_ID_BY_PROPOSER, accountAddress],
    queryFn: () =>
      callOrThrow({ governorBravoDelegateContractAddress }, params =>
        getLatestProposalIdByProposer({
          publicClient,
          accountAddress,
          ...params,
        }),
      ),
    staleTime: blockTimeMs,
    ...options,
  });
};
