import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useGetTokens } from 'libs/tokens';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { generatePseudoRandomRefetchInterval } from 'utilities/generatePseudoRandomRefetchInterval';

import { usePrimeVersion } from 'hooks/usePrimeVersion';
import type { GetPoolsInput } from '../types';
import { getPools } from './getPools';
import type { GetPoolsQueryOutput } from './getPools';

export type TrimmedInput = Omit<
  GetPoolsInput,
  | 'chainId'
  | 'tokens'
  | 'publicClient'
  | 'primeContractAddress'
  | 'poolLensContractAddress'
  | 'legacyPoolComptrollerContractAddress'
  | 'venusLensContractAddress'
  | 'vaiControllerContractAddress'
  | 'resilientOracleContractAddress'
  | 'isEModeFeatureEnabled'
>;

export type UseGetPoolsQueryKey = [
  FunctionKey.GET_POOLS,
  TrimmedInput & {
    chainId: ChainId;
  },
];

export type UseGetPoolsQueryOptions = Partial<
  QueryObserverOptions<
    GetPoolsQueryOutput,
    Error,
    GetPoolsQueryOutput,
    GetPoolsQueryOutput,
    UseGetPoolsQueryKey
  >
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

export const useGetPoolsQuery = (input?: TrimmedInput, options?: UseGetPoolsQueryOptions) => {
  const isEModeFeatureEnabled = useIsFeatureEnabled({
    name: 'eMode',
  });

  const accountAddress = input?.accountAddress;
  const { chainId } = useChainId();
  const tokens = useGetTokens();

  const { primeVersion } = usePrimeVersion();

  const { publicClient } = usePublicClient();

  const { address: primeV1ContractAddress } = useGetContractAddress({
    name: 'Prime',
  });
  const { address: primeV2ContractAddress } = useGetContractAddress({
    name: 'PrimeV2',
  });
  const { address: primeV2LensContractAddress } = useGetContractAddress({
    name: 'PrimeV2Lens',
  });

  const { address: poolLensContractAddress } = useGetContractAddress({
    name: 'PoolLens',
  });
  const { address: legacyPoolComptrollerContractAddress } = useGetContractAddress({
    name: 'LegacyPoolComptroller',
  });
  const { address: venusLensContractAddress } = useGetContractAddress({
    name: 'VenusLens',
  });
  const { address: vaiControllerContractAddress } = useGetContractAddress({
    name: 'VaiController',
  });
  const { address: resilientOracleContractAddress } = useGetContractAddress({
    name: 'ResilientOracle',
  });

  return useQuery({
    queryKey: [FunctionKey.GET_POOLS, { ...input, chainId, accountAddress }],
    queryFn: () =>
      getPools({
        publicClient,
        chainId,
        tokens,
        legacyPoolComptrollerContractAddress,
        venusLensContractAddress,
        poolLensContractAddress,
        vaiControllerContractAddress,
        resilientOracleContractAddress,
        primeV1ContractAddress,
        primeV2ContractAddress,
        primeV2LensContractAddress,
        primeVersion,
        isEModeFeatureEnabled,
        ...input,
      }),
    placeholderData: (previousOutput, previousInput) => {
      // Return previous data if chain ID param hasn't changed and user address was undefined
      const previousChainId = previousInput?.queryKey[1]?.chainId;
      return previousChainId === chainId && !previousInput?.queryKey[1].accountAddress
        ? previousOutput
        : undefined;
    },
    refetchInterval,
    ...options,
  });
};
