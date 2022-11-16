import BigNumber from 'bignumber.js';
import { QueryObserverOptions, useQuery } from 'react-query';

import getVTokenApySimulations, {
  GetVTokenApySimulationsOutput,
} from 'clients/api/queries/getVTokenApySimulations';
import useGetVTokenInterestRateModel from 'clients/api/queries/getVTokenInterestRateModel/useGetVTokenInterestRateModel';
import { useMulticall } from 'clients/web3';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVTokenApySimulationsOutput,
  Error,
  GetVTokenApySimulationsOutput,
  GetVTokenApySimulationsOutput,
  [FunctionKey.GET_V_TOKEN_APY_SIMULATIONS, string]
>;

const useGetVTokenApySimulations = (
  { vTokenId, reserveFactorMantissa }: { vTokenId: string; reserveFactorMantissa?: BigNumber },
  options?: Options,
) => {
  const multicall = useMulticall();
  const { data: interestRateModelData } = useGetVTokenInterestRateModel({ vTokenId });

  return useQuery(
    [FunctionKey.GET_V_TOKEN_APY_SIMULATIONS, vTokenId],
    () =>
      getVTokenApySimulations({
        multicall,
        reserveFactorMantissa: reserveFactorMantissa || new BigNumber(0),
        interestRateModelContractAddress: interestRateModelData?.contractAddress || '',
      }),
    {
      ...options,
      enabled:
        (options?.enabled === undefined || options?.enabled) &&
        interestRateModelData?.contractAddress !== undefined &&
        reserveFactorMantissa !== undefined,
    },
  );
};

export default useGetVTokenApySimulations;
