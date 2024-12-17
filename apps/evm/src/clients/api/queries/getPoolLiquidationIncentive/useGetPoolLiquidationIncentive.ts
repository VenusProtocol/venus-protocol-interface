import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import {
  type GetPoolLiquidationIncentiveInput,
  type GetPoolLiquidationIncentiveOutput,
  getPoolLiquidationIncentive,
} from 'clients/api/queries/getPoolLiquidationIncentive';
import FunctionKey from 'constants/functionKey';
import {
  useGetIsolatedPoolComptrollerContract,
  useGetLegacyPoolComptrollerContract,
} from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow, isPoolIsolated } from 'utilities';

interface TrimmedGetPoolLiquidationIncentiveInput
  extends Omit<GetPoolLiquidationIncentiveInput, 'poolComptrollerContract'> {
  poolComptrollerContractAddress: string;
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

  const legacyPoolComptrollerContract = useGetLegacyPoolComptrollerContract();
  const isolatedPoolComptrollerContract = useGetIsolatedPoolComptrollerContract({
    address: poolComptrollerContractAddress,
    passSigner: false,
  });

  const isIsolated = isPoolIsolated({
    chainId,
    comptrollerAddress: poolComptrollerContractAddress,
  });

  const poolComptrollerContract = isIsolated
    ? isolatedPoolComptrollerContract
    : legacyPoolComptrollerContract;

  return useQuery({
    queryKey: [
      FunctionKey.GET_POOL_LIQUIDATION_INCENTIVE,
      { poolComptrollerContractAddress, chainId },
    ],
    queryFn: () => callOrThrow({ poolComptrollerContract }, getPoolLiquidationIncentive),
    ...options,
  });
};
