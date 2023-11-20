import { getJumpRateModelContract, getJumpRateModelV2Contract } from 'packages/contracts';
import { useMemo } from 'react';
import { QueryObserverOptions, useQuery } from 'react-query';
import { Asset, ChainId, VToken } from 'types';

import getVTokenApySimulations, {
  GetVTokenApySimulationsOutput,
} from 'clients/api/queries/getVTokenApySimulations';
import useGetVTokenInterestRateModel from 'clients/api/queries/getVTokenInterestRateModel/useGetVTokenInterestRateModel';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';

export type UseGetVTokenApySimulationsQueryKey = [
  FunctionKey.GET_V_TOKEN_APY_SIMULATIONS,
  { vTokenAddress: string; chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetVTokenApySimulationsOutput,
  Error,
  GetVTokenApySimulationsOutput,
  GetVTokenApySimulationsOutput,
  UseGetVTokenApySimulationsQueryKey
>;

const useGetVTokenApySimulations = (
  {
    asset,
    vToken,
    isIsolatedPoolMarket,
  }: {
    asset: Asset | undefined;
    vToken: VToken;
    isIsolatedPoolMarket: boolean;
  },
  options?: Options,
) => {
  const { provider, chainId } = useAuth();
  const { blocksPerDay } = useGetChainMetadata();

  const { data: interestRateModelData } = useGetVTokenInterestRateModel({ vToken });

  const interestRateModelContract = useMemo(() => {
    if (!interestRateModelData?.contractAddress) {
      return undefined;
    }

    const input = {
      address: interestRateModelData.contractAddress,
      signerOrProvider: provider,
    };

    return isIsolatedPoolMarket
      ? getJumpRateModelV2Contract(input)
      : getJumpRateModelContract(input);
  }, [interestRateModelData?.contractAddress, isIsolatedPoolMarket, provider]);

  return useQuery(
    [FunctionKey.GET_V_TOKEN_APY_SIMULATIONS, { vTokenAddress: vToken.address, chainId }],
    () =>
      getVTokenApySimulations({
        interestRateModelContract: interestRateModelContract!, // Checked through enabled option
        asset: asset!, // Checked through enabled option
        isIsolatedPoolMarket,
        blocksPerDay,
      }),
    {
      ...options,
      enabled:
        (options?.enabled === undefined || options?.enabled) &&
        !!interestRateModelContract &&
        !!asset,
    },
  );
};

export default useGetVTokenApySimulations;
