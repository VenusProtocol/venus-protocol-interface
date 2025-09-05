import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useGetTokens } from 'libs/tokens';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow, generatePseudoRandomRefetchInterval } from 'utilities';

import { getPools } from './getPools';
import type { GetPoolsInput, GetPoolsOutput } from './types';

type TrimmedInput = Omit<
  GetPoolsInput,
  | 'chainId'
  | 'tokens'
  | 'publicClient'
  | 'primeContractAddress'
  | 'poolLensContractAddress'
  | 'legacyPoolComptrollerContractAddress'
  | 'venusLensContractAddress'
  | 'vaiControllerContractAddress'
  | 'isEModeEnabledFeature'
>;

export type UseGetPoolsQueryKey = [
  FunctionKey.GET_POOLS,
  TrimmedInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetPoolsOutput,
  Error,
  GetPoolsOutput,
  GetPoolsOutput,
  UseGetPoolsQueryKey
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

export const useGetPools = (input?: TrimmedInput, options?: Options) => {
  const isPrimeEnabled = useIsFeatureEnabled({
    name: 'prime',
  });

  const isEModeEnabledFeature = useIsFeatureEnabled({
    name: 'eMode',
  });

  const accountAddress = input?.accountAddress;
  const { chainId } = useChainId();
  const tokens = useGetTokens();

  const { publicClient } = usePublicClient();

  const { address: primeContractAddress } = useGetContractAddress({
    name: 'Prime',
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

  return useQuery({
    queryKey: [FunctionKey.GET_POOLS, { ...input, chainId, accountAddress }],
    queryFn: () =>
      callOrThrow({ poolLensContractAddress }, params =>
        getPools({
          publicClient,
          chainId,
          tokens,
          legacyPoolComptrollerContractAddress,
          venusLensContractAddress,
          vaiControllerContractAddress,
          primeContractAddress: isPrimeEnabled ? primeContractAddress : undefined,
          isEModeEnabledFeature,
          ...params,
          ...input,
        }),
      ),
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
