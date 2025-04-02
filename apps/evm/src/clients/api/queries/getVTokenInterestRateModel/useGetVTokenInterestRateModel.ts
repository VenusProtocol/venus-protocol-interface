import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';

import {
  type GetVTokenInterestRateModelOutput,
  getVTokenInterestRateModel,
} from 'clients/api/queries/getVTokenInterestRateModel';
import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId, VToken } from 'types';
import type { Address } from 'viem';

export type UseGetVTokenInterestRateModelQueryKey = [
  FunctionKey.GET_V_TOKEN_INTEREST_RATE_MODEL,
  { vTokenAddress: Address; chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetVTokenInterestRateModelOutput,
  Error,
  GetVTokenInterestRateModelOutput,
  GetVTokenInterestRateModelOutput,
  UseGetVTokenInterestRateModelQueryKey
>;

export const useGetVTokenInterestRateModel = (
  { vToken }: { vToken: VToken },
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: [
      FunctionKey.GET_V_TOKEN_INTEREST_RATE_MODEL,
      { vTokenAddress: vToken.address, chainId },
    ],
    queryFn: () =>
      getVTokenInterestRateModel({
        publicClient,
        vTokenAddress: vToken.address,
      }),
    ...options,
  });
};
