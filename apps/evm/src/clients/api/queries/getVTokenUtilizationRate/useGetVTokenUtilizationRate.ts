import { useMemo } from 'react';
import { type QueryObserverOptions, useQuery } from 'react-query';

import useGetVTokenInterestRateModel from 'clients/api/queries/getVTokenInterestRateModel/useGetVTokenInterestRateModel';
import {
  getVTokenUtilizationRate,
  type GetVTokenUtilizationRateOutput,
} from 'clients/api/queries/getVTokenUtilizationRate';
import FunctionKey from 'constants/functionKey';
import { getJumpRateModelContract, getJumpRateModelV2Contract } from 'libs/contracts';
import { useChainId, useProvider } from 'libs/wallet';
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
  options?: Options,
) => {
  const { provider } = useProvider();
  const { chainId } = useChainId();

  const { data: interestRateModelData } = useGetVTokenInterestRateModel(
    { vToken: asset?.vToken! },
    {
      enabled: !!asset,
    },
  );

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
    [
      FunctionKey.GET_V_TOKEN_UTILIZATION_RATE,
      { vTokenAddress: asset?.vToken.address || '', chainId },
    ],
    () =>
      callOrThrow({ interestRateModelContract, asset }, params =>
        getVTokenUtilizationRate({
          ...params,
          isIsolatedPoolMarket,
        }),
      ),
    {
      ...options,
      enabled:
        (options?.enabled === undefined || options?.enabled) &&
        !!interestRateModelContract &&
        !!asset,
    },
  );
};
