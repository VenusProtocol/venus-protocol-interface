import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import { useGetVTokenInterestRateModel } from 'clients/api/queries/getVTokenInterestRateModel/useGetVTokenInterestRateModel';
import {
  type GetVTokenUtilizationRateOutput,
  getVTokenUtilizationRate,
} from 'clients/api/queries/getVTokenUtilizationRate';
import FunctionKey from 'constants/functionKey';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { Asset, ChainId } from 'types';
import { callOrThrow } from 'utilities';

export type UseGetVTokenUtilizationRateQueryKey = [
  FunctionKey.GET_V_TOKEN_UTILIZATION_RATE,
  { vTokenAddress: string; chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetVTokenUtilizationRateOutput,
  Error,
  GetVTokenUtilizationRateOutput,
  GetVTokenUtilizationRateOutput,
  UseGetVTokenUtilizationRateQueryKey
>;

export const useGetVTokenUtilizationRate = (
  {
    asset,
    isIsolatedPoolMarket,
  }: {
    asset: Asset | undefined;
    isIsolatedPoolMarket: boolean;
  },
  options?: Partial<Options>,
) => {
  const { publicClient } = usePublicClient();
  const { chainId } = useChainId();

  const { data: interestRateModelData, isLoading: isInterestRateModelLoading } =
    useGetVTokenInterestRateModel(
      { vToken: asset?.vToken! },
      {
        enabled: !!asset,
      },
    );
  const interestRateModelContractAddress = interestRateModelData?.contractAddress;

  return useQuery({
    queryKey: [
      FunctionKey.GET_V_TOKEN_UTILIZATION_RATE,
      { vTokenAddress: asset?.vToken.address || '', chainId },
    ],
    queryFn: () =>
      callOrThrow({ interestRateModelContractAddress, asset }, params =>
        getVTokenUtilizationRate({
          publicClient,
          isIsolatedPoolMarket,
          ...params,
        }),
      ),
    ...options,
    enabled:
      (options?.enabled === undefined || options?.enabled) &&
      !isInterestRateModelLoading &&
      !!interestRateModelContractAddress &&
      !!asset,
  });
};
