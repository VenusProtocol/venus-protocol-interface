import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import type { ChainId } from '@venusprotocol/chains';
import {
  type GetIsolatedPoolVTokenLiquidationThresholdInput,
  type GetIsolatedPoolVTokenLiquidationThresholdOutput,
  getIsolatedPoolVTokenLiquidationThreshold,
} from 'clients/api/queries/getIsolatedPoolVTokenLiquidationThreshold';
import FunctionKey from 'constants/functionKey';
import { useGetIsolatedPoolComptrollerContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { callOrThrow } from 'utilities';

interface TrimmedGetIsolatedPoolVTokenLiquidationThresholdInput
  extends Omit<GetIsolatedPoolVTokenLiquidationThresholdInput, 'poolComptrollerContract'> {
  poolComptrollerContractAddress: string;
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

  const poolComptrollerContract = useGetIsolatedPoolComptrollerContract({
    address: poolComptrollerContractAddress,
    passSigner: false,
  });

  return useQuery({
    queryKey: [
      FunctionKey.GET_ISOLATED_POOL_V_TOKEN_LIQUIDATION_THRESHOLD,
      { poolComptrollerContractAddress, vTokenAddress, chainId },
    ],

    queryFn: () =>
      callOrThrow({ poolComptrollerContract }, params =>
        getIsolatedPoolVTokenLiquidationThreshold({
          ...params,
          vTokenAddress,
        }),
      ),

    ...options,
  });
};
