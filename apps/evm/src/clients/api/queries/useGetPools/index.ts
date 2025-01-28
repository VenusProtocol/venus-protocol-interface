import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import {
  useGetLegacyPoolComptrollerContractAddress,
  useGetPoolLensContractAddress,
  useGetPrimeContractAddress,
  useGetVaiControllerContractAddress,
  useGetVenusLensContractAddress,
} from 'libs/contracts';
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

  const accountAddress = input?.accountAddress;
  const { chainId } = useChainId();
  const tokens = useGetTokens();

  const { publicClient } = usePublicClient();
  const primeContractAddress = useGetPrimeContractAddress();
  const poolLensContractAddress = useGetPoolLensContractAddress();
  const legacyPoolComptrollerContractAddress = useGetLegacyPoolComptrollerContractAddress();
  const venusLensContractAddress = useGetVenusLensContractAddress();
  const vaiControllerContractAddress = useGetVaiControllerContractAddress();

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
          ...params,
          ...input,
        }),
      ),
    placeholderData: (previousOutput, previousInput) => {
      // Return previous data if chain ID param hasn't changed
      const previousChainId = previousInput?.queryKey[1]?.chainId;
      return previousChainId === chainId ? previousOutput : undefined;
    },
    refetchInterval,
    ...options,
  });
};
