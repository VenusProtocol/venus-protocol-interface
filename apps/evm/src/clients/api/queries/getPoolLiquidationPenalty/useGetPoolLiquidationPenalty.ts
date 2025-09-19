import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import type { Address } from 'viem';
import {
  type GetPoolLiquidationPenaltyInput,
  type GetPoolLiquidationPenaltyOutput,
  getPoolLiquidationPenalty,
} from '.';

interface TrimmedGetPoolLiquidationPenaltyInput
  extends Omit<GetPoolLiquidationPenaltyInput, 'publicClient'> {
  poolComptrollerContractAddress: Address;
}

export type UseGetPoolLiquidationPenaltyQueryKey = [
  FunctionKey.GET_POOL_LIQUIDATION_PENALTY,
  TrimmedGetPoolLiquidationPenaltyInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetPoolLiquidationPenaltyOutput,
  Error,
  GetPoolLiquidationPenaltyOutput,
  GetPoolLiquidationPenaltyOutput,
  UseGetPoolLiquidationPenaltyQueryKey
>;

export const useGetPoolLiquidationPenalty = (
  { poolComptrollerContractAddress }: TrimmedGetPoolLiquidationPenaltyInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();

  return useQuery({
    queryKey: [
      FunctionKey.GET_POOL_LIQUIDATION_PENALTY,
      { poolComptrollerContractAddress, chainId },
    ],
    queryFn: () =>
      callOrThrow({ poolComptrollerContractAddress }, params =>
        getPoolLiquidationPenalty({
          publicClient,
          ...params,
        }),
      ),
    ...options,
  });
};
