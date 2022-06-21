import { useQuery, QueryObserverOptions } from 'react-query';
import getProposal from 'clients/api/queries/getProposals/getProposal';
import { IGetProposalInput, GetProposalOutput } from 'clients/api/queries/getProposals/types';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetProposalOutput,
  Error,
  GetProposalOutput,
  GetProposalOutput,
  [FunctionKey.GET_PROPOSAL, IGetProposalInput]
>;

const useGetProposal = (params: IGetProposalInput, options?: Options) =>
  useQuery([FunctionKey.GET_PROPOSAL, params], () => getProposal(params), {
    ...options,
  });

export default useGetProposal;
