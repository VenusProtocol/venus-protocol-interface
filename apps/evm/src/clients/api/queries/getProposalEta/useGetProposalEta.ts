import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import getProposalEta, {
  type GetProposalEtaInput,
  type GetProposalEtaOutput,
} from 'clients/api/queries/getProposalEta';
import FunctionKey from 'constants/functionKey';
import { getGovernorBravoDelegateContractAddress } from 'libs/contracts';
import { usePublicClient } from 'libs/wallet';
import { governanceChain } from 'libs/wallet';
import { callOrThrow } from 'utilities';

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

const useGetProposalEta = (input: TrimmedGetProposalEtaInput, options?: Partial<Options>) => {
  const { publicClient } = usePublicClient({
    chainId: governanceChain.id,
  });
  const governorBravoDelegateContractAddress = getGovernorBravoDelegateContractAddress({
    chainId: governanceChain.id,
  });

  return useQuery({
    queryKey: [FunctionKey.GET_PROPOSAL_ETA, input],

    queryFn: () =>
      callOrThrow({ publicClient, governorBravoDelegateContractAddress }, params =>
        getProposalEta({
          ...input,
          ...params,
        }),
      ),

    ...options,
  });
};

export default useGetProposalEta;
