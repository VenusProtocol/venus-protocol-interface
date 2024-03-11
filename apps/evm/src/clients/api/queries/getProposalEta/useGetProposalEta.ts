import { type QueryObserverOptions, useQuery } from 'react-query';

import getProposalEta, {
  type GetProposalEtaInput,
  type GetProposalEtaOutput,
} from 'clients/api/queries/getProposalEta';
import FunctionKey from 'constants/functionKey';
import { useGetGovernorBravoDelegateContract } from 'libs/contracts';
import { governanceChain } from 'libs/wallet';
import { callOrThrow } from 'utilities';

type TrimmedGetProposalEtaInput = Omit<GetProposalEtaInput, 'governorBravoDelegateContract'>;

type Options = QueryObserverOptions<
  GetProposalEtaOutput,
  Error,
  GetProposalEtaOutput,
  GetProposalEtaOutput,
  [FunctionKey.GET_PROPOSAL_ETA, TrimmedGetProposalEtaInput]
>;

const useGetProposalEta = (input: TrimmedGetProposalEtaInput, options?: Options) => {
  const governorBravoDelegateContract = useGetGovernorBravoDelegateContract({
    chainId: governanceChain.id,
  });

  return useQuery(
    [FunctionKey.GET_PROPOSAL_ETA, input],
    () =>
      callOrThrow({ governorBravoDelegateContract }, params =>
        getProposalEta({
          ...input,
          ...params,
        }),
      ),
    options,
  );
};

export default useGetProposalEta;
