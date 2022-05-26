import BigNumber from 'bignumber.js';
import { useQuery, QueryObserverOptions } from 'react-query';

import { InterestModel } from 'types/contracts';
import { useWeb3 } from 'clients/web3';
import { getInterestModelContract } from 'clients/contracts/getters';
import getVTokenApySimulations, {
  GetVTokenApySimulationsOutput,
} from 'clients/api/queries/getVTokenApySimulations';
import useGetVTokenInterestRateModel from 'clients/api/queries/useGetVTokenInterestRateModel';
import { VTokenId } from 'types';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVTokenApySimulationsOutput,
  Error,
  GetVTokenApySimulationsOutput,
  GetVTokenApySimulationsOutput,
  [FunctionKey.GET_V_TOKEN_APY_SIMULATIONS, VTokenId]
>;

const useGetVTokenApySimulations = (
  { vTokenId, reserveFactorMantissa }: { vTokenId: VTokenId; reserveFactorMantissa?: BigNumber },
  options?: Options,
) => {
  const web3 = useWeb3();
  const { data: interestRateModelContractAddress } = useGetVTokenInterestRateModel({ vTokenId });
  const interestModelContract = interestRateModelContractAddress
    ? getInterestModelContract(interestRateModelContractAddress, web3)
    : undefined;

  return useQuery(
    [FunctionKey.GET_V_TOKEN_APY_SIMULATIONS, vTokenId],
    () =>
      getVTokenApySimulations({
        interestModelContract: interestModelContract || ({} as InterestModel),
        reserveFactorMantissa: reserveFactorMantissa || new BigNumber(0),
      }),
    {
      ...options,
      enabled:
        (options?.enabled === undefined || options?.enabled) &&
        interestRateModelContractAddress !== undefined &&
        reserveFactorMantissa !== undefined,
    },
  );
};

export default useGetVTokenApySimulations;
