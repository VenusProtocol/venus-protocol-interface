import { useQuery, QueryObserverOptions } from 'react-query';

import getProposalEta, {
  GetProposalEtaInput,
  GetProposalEtaOutput,
} from 'clients/api/queries/getProposalEta';
import FunctionKey from 'constants/functionKey';
import { useGovernorBravoDelegateContract } from 'clients/contracts/hooks';

type Options = QueryObserverOptions<
  GetProposalEtaOutput,
  Error,
  GetProposalEtaOutput,
  GetProposalEtaOutput,
  [FunctionKey.GET_PROPOSAL_ETA, Omit<GetProposalEtaInput, 'governorBravoContract'>]
>;

const useGetProposalEta = (
  params: Omit<GetProposalEtaInput, 'governorBravoContract'>,
  options?: Options,
) => {
  const governorBravoContract = useGovernorBravoDelegateContract();

  return useQuery(
    [FunctionKey.GET_PROPOSAL_ETA, params],
    () => getProposalEta({ governorBravoContract, ...params }),
    options,
  );
};

export default useGetProposalEta;
