import { QueryObserverOptions, useQuery } from 'react-query';

import getVTokenInterestRateModel, {
  GetVTokenInterestRateModelOutput,
} from 'clients/api/queries/getVTokenInterestRateModel';
import { useVTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVTokenInterestRateModelOutput,
  Error,
  GetVTokenInterestRateModelOutput,
  GetVTokenInterestRateModelOutput,
  [FunctionKey.GET_V_TOKEN_INTEREST_RATE_MODEL, string]
>;

const useGetVTokenInterestRateModel = ({ vTokenId }: { vTokenId: string }, options?: Options) => {
  const vTokenContract = useVTokenContract(vTokenId);

  return useQuery(
    [FunctionKey.GET_V_TOKEN_INTEREST_RATE_MODEL, vTokenId],
    () => getVTokenInterestRateModel({ vTokenContract }),
    options,
  );
};

export default useGetVTokenInterestRateModel;
