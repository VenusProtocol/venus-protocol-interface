import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { getContractAddress } from 'libs/contracts';
import { governanceChain, usePublicClient } from 'libs/wallet';
import { callOrThrow } from 'utilities';
import { type GetProposalThresholdOutput, getProposalThreshold } from '.';

type Options = QueryObserverOptions<
  GetProposalThresholdOutput,
  Error,
  GetProposalThresholdOutput,
  GetProposalThresholdOutput,
  [FunctionKey.GET_PROPOSAL_THRESHOLD]
>;

export const useGetProposalThreshold = (options?: Partial<Options>) => {
  const { publicClient } = usePublicClient({
    chainId: governanceChain.id,
  });
  const governorBravoDelegateAddress = getContractAddress({
    name: 'GovernorBravoDelegate',
    chainId: governanceChain.id,
  });

  return useQuery({
    queryKey: [FunctionKey.GET_PROPOSAL_THRESHOLD],
    queryFn: () =>
      callOrThrow({ governorBravoDelegateAddress }, params =>
        getProposalThreshold({ ...params, publicClient }),
      ),
    ...options,
  });
};
