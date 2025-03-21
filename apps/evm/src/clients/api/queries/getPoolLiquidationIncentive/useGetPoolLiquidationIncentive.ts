import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import {
  type GetPoolLiquidationIncentiveInput,
  type GetPoolLiquidationIncentiveOutput,
  getPoolLiquidationIncentive,
} from 'clients/api/queries/getPoolLiquidationIncentive';
import FunctionKey from 'constants/functionKey';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import type { Address } from 'viem';

interface TrimmedGetPoolLiquidationIncentiveInput
  extends Omit<GetPoolLiquidationIncentiveInput, 'publicClient'> {
  poolComptrollerContractAddress: Address;
}

export type UseGetPoolLiquidationIncentiveQueryKey = [
  FunctionKey.GET_POOL_LIQUIDATION_INCENTIVE,
  TrimmedGetPoolLiquidationIncentiveInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetPoolLiquidationIncentiveOutput,
  Error,
  GetPoolLiquidationIncentiveOutput,
  GetPoolLiquidationIncentiveOutput,
  UseGetPoolLiquidationIncentiveQueryKey
>;

export const useGetPoolLiquidationIncentive = (
  { poolComptrollerContractAddress }: TrimmedGetPoolLiquidationIncentiveInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();

  return useQuery({
    queryKey: [
      FunctionKey.GET_POOL_LIQUIDATION_INCENTIVE,
      { poolComptrollerContractAddress, chainId },
    ],
    queryFn: () =>
      callOrThrow({ poolComptrollerContractAddress }, params =>
        getPoolLiquidationIncentive({
          publicClient,
          ...params,
        }),
      ),
    ...options,
  });
};
