import { QueryObserverOptions, useQuery } from 'react-query';
import { VToken } from 'types';
import { callOrThrow } from 'utilities';

import getVTokenInterestRateModel, {
  GetVTokenInterestRateModelOutput,
} from 'clients/api/queries/getVTokenInterestRateModel';
import FunctionKey from 'constants/functionKey';
import useGetVTokenContract from 'hooks/useGetVTokenContract';

type Options = QueryObserverOptions<
  GetVTokenInterestRateModelOutput,
  Error,
  GetVTokenInterestRateModelOutput,
  GetVTokenInterestRateModelOutput,
  [FunctionKey.GET_V_TOKEN_INTEREST_RATE_MODEL, { vTokenAddress: string }]
>;

const useGetVTokenInterestRateModel = ({ vToken }: { vToken: VToken }, options?: Options) => {
  const vTokenContract = useGetVTokenContract({ vToken });

  return useQuery(
    [FunctionKey.GET_V_TOKEN_INTEREST_RATE_MODEL, { vTokenAddress: vToken.address }],
    () => callOrThrow({ vTokenContract }, getVTokenInterestRateModel),
    options,
  );
};

export default useGetVTokenInterestRateModel;
