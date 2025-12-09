import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import { getBlockTimeByChainId } from '@venusprotocol/chains';

import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';
import { getContractAddress } from 'libs/contracts';
import { governanceChainId, usePublicClient } from 'libs/wallet';
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

const { blockTimeMs: BSC_BLOCK_TIME_MS } =
  getBlockTimeByChainId({ chainId: governanceChainId }) ?? {};

const governorBravoDelegateContractAddress = getContractAddress({
  name: 'GovernorBravoDelegate',
  chainId: governanceChainId,
});

export const useGetLatestProposalIdByProposer = (
  { accountAddress }: TrimmedGetLatestProposalIdByProposerInput,
  options?: Partial<Options>,
) => {
  const { publicClient } = usePublicClient({
    chainId: governanceChainId,
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
    staleTime: BSC_BLOCK_TIME_MS || DEFAULT_REFETCH_INTERVAL_MS,
    ...options,
  });
};
