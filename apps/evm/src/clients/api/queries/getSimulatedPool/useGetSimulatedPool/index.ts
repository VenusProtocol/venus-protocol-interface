import { type QueryObserverOptions, keepPreviousData, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { usePrimeVersion } from 'hooks/usePrimeVersion';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { type GetSimulatedPoolInput, type GetSimulatedPoolOutput, getSimulatedPool } from '..';

type TrimmedSimulatedPoolInput = Omit<
  GetSimulatedPoolInput,
  'primeAprContractAddress' | 'primeVersion' | 'publicClient'
>;

export type useGetSimulatedPoolQueryKey = [
  FunctionKey.GET_SIMULATED_POOL,
  {
    chainId: ChainId;
    balanceMutations: TrimmedSimulatedPoolInput['balanceMutations'];
    serializedPool?: string;
  },
];

type Options = QueryObserverOptions<
  GetSimulatedPoolOutput,
  Error,
  GetSimulatedPoolOutput,
  GetSimulatedPoolOutput,
  useGetSimulatedPoolQueryKey
>;

export const useGetSimulatedPool = (
  input: TrimmedSimulatedPoolInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const { primeVersion } = usePrimeVersion();
  const { address: primeContractAddress } = useGetContractAddress({
    name: 'Prime',
  });
  const { address: primeV2LensContractAddress } = useGetContractAddress({
    name: 'PrimeV2Lens',
  });
  const primeAprContractAddress =
    primeVersion === 1 ? primeContractAddress : primeV2LensContractAddress;

  const serializedPool = JSON.stringify(input.pool, (_key, value) =>
    typeof value === 'bigint' ? value.toString() : value,
  );

  return useQuery({
    queryKey: [
      FunctionKey.GET_SIMULATED_POOL,
      {
        balanceMutations: input.balanceMutations,
        serializedPool,
        chainId,
      },
    ],
    queryFn: () =>
      getSimulatedPool({
        ...input,
        primeAprContractAddress,
        primeVersion,
        publicClient,
      }),
    placeholderData: keepPreviousData,
    ...options,
  });
};
