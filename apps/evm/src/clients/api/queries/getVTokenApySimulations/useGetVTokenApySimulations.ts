import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';

import FunctionKey from 'constants/functionKey';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import { getVTokenApySimulations } from '.';
import { useGetVTokenInterestRateModel } from '../getVTokenInterestRateModel/useGetVTokenInterestRateModel';
import type { GetVTokenApySimulationsInput, GetVTokenApySimulationsOutput } from './types';

type TrimmedGetVTokenApySimulationsInput = Omit<
  GetVTokenApySimulationsInput,
  'publicClient' | 'interestRateModelContractAddress'
>;

type Options = QueryObserverOptions<
  GetVTokenApySimulationsOutput,
  Error,
  GetVTokenApySimulationsOutput,
  GetVTokenApySimulationsOutput,
  [FunctionKey.GET_V_TOKEN_APY_SIMULATIONS, { chainId: ChainId; vTokenAddress: string }]
>;

export const useGetVTokenApySimulations = (
  input: TrimmedGetVTokenApySimulationsInput,
  options?: Options,
) => {
  const publicClient = usePublicClient();
  const { chainId } = useChainId();
  const { data: interestRateModelData } = useGetVTokenInterestRateModel({
    vToken: input.asset.vToken,
  });
  const interestRateModelContractAddress = interestRateModelData?.contractAddress;
  const { blocksPerDay } = useGetChainMetadata();

  return useQuery({
    queryKey: [
      FunctionKey.GET_V_TOKEN_APY_SIMULATIONS,
      {
        chainId,
        vTokenAddress: input.asset.vToken.address,
      },
    ],
    queryFn: () =>
      callOrThrow({ interestRateModelContractAddress }, params =>
        getVTokenApySimulations({
          ...input,
          ...params,
          publicClient,
          blocksPerDay,
        }),
      ),
    ...options,
    enabled:
      (options?.enabled === undefined || options?.enabled) &&
      !!interestRateModelContractAddress &&
      !!input.asset,
  });
};
