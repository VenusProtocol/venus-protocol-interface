import { useGetGovernorBravoDelegateContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getProposalEta, {
  GetProposalEtaInput,
  GetProposalEtaOutput,
} from 'clients/api/queries/getProposalEta';
import { governanceChain } from 'clients/web3';
import FunctionKey from 'constants/functionKey';

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
