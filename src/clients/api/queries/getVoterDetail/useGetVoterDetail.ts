import { useQuery, QueryObserverOptions } from 'react-query';
import getVoterDetail, {
  IGetVoterDetailInput,
  GetVoterDetailOutput,
} from 'clients/api/queries/getVoterDetail';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVoterDetailOutput,
  Error,
  GetVoterDetailOutput,
  GetVoterDetailOutput,
  [FunctionKey.GET_VOTER_DETAIL, IGetVoterDetailInput]
>;

const useGetVoterDetail = (params: IGetVoterDetailInput, options?: Options) =>
  // This endpoint is paginated so we keep the previous responses by default to create a more seamless paginating experience
  useQuery([FunctionKey.GET_VOTER_DETAIL, params], () => getVoterDetail(params), options);

export default useGetVoterDetail;
