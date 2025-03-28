import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import type { Address } from 'viem';
import {
  type GetIsolatedPoolVTokenLiquidationThresholdInput,
  type GetIsolatedPoolVTokenLiquidationThresholdOutput,
  getIsolatedPoolVTokenLiquidationThreshold,
} from '.';

interface TrimmedGetIsolatedPoolVTokenLiquidationThresholdInput
  extends Omit<
    GetIsolatedPoolVTokenLiquidationThresholdInput,
    'poolComptrollerContract' | 'publicClient'
  > {
  poolComptrollerContractAddress: Address;
}

export type UseGetIsolatedPoolVTokenLiquidationThresholdQueryKey = [
  FunctionKey.GET_ISOLATED_POOL_V_TOKEN_LIQUIDATION_THRESHOLD,
  TrimmedGetIsolatedPoolVTokenLiquidationThresholdInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetIsolatedPoolVTokenLiquidationThresholdOutput,
  Error,
  GetIsolatedPoolVTokenLiquidationThresholdOutput,
  GetIsolatedPoolVTokenLiquidationThresholdOutput,
  UseGetIsolatedPoolVTokenLiquidationThresholdQueryKey
>;

export const useGetIsolatedPoolVTokenLiquidationThreshold = (
  {
    poolComptrollerContractAddress,
    vTokenAddress,
  }: TrimmedGetIsolatedPoolVTokenLiquidationThresholdInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();

  return useQuery({
    queryKey: [
      FunctionKey.GET_ISOLATED_POOL_V_TOKEN_LIQUIDATION_THRESHOLD,
      { poolComptrollerContractAddress, vTokenAddress, chainId },
    ],

    queryFn: () =>
      callOrThrow({ poolComptrollerContractAddress }, params =>
        getIsolatedPoolVTokenLiquidationThreshold({
          publicClient,
          vTokenAddress,
          ...params,
        }),
      ),

    ...options,
  });
};
