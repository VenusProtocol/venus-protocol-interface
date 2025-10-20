import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { getContractAddress } from 'libs/contracts';
import { usePublicClient } from 'libs/wallet';
import { governanceChainId } from 'libs/wallet';
import { callOrThrow } from 'utilities';
import { type GetProposalEtaInput, type GetProposalEtaOutput, getProposalEta } from '.';

type TrimmedGetProposalEtaInput = Omit<
  GetProposalEtaInput,
  'publicClient' | 'governorBravoDelegateContractAddress'
>;

type Options = QueryObserverOptions<
  GetProposalEtaOutput,
  Error,
  GetProposalEtaOutput,
  GetProposalEtaOutput,
  [FunctionKey.GET_PROPOSAL_ETA, TrimmedGetProposalEtaInput]
>;

export const useGetProposalEta = (
  input: TrimmedGetProposalEtaInput,
  options?: Partial<Options>,
) => {
  const { publicClient } = usePublicClient({
    chainId: governanceChainId,
  });

  const governorBravoDelegateContractAddress = getContractAddress({
    name: 'GovernorBravoDelegate',
    chainId: governanceChainId,
  });

  return useQuery({
    queryKey: [FunctionKey.GET_PROPOSAL_ETA, input],

    queryFn: () =>
      callOrThrow({ governorBravoDelegateContractAddress }, params =>
        getProposalEta({
          ...input,
          ...params,
          publicClient,
        }),
      ),

    ...options,
  });
};
