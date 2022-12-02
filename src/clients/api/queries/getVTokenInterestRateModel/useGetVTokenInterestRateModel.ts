import { QueryObserverOptions, useQuery } from 'react-query';
import { VToken } from 'types';

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
  [FunctionKey.GET_V_TOKEN_INTEREST_RATE_MODEL, { vTokenAddress: string }]
>;

const useGetVTokenInterestRateModel = ({ vToken }: { vToken: VToken }, options?: Options) => {
  const vTokenContract = useVTokenContract(vToken);

  return useQuery(
    [FunctionKey.GET_V_TOKEN_INTEREST_RATE_MODEL, { vTokenAddress: vToken.address }],
    () => getVTokenInterestRateModel({ vTokenContract }),
    options,
  );
};

export default useGetVTokenInterestRateModel;
