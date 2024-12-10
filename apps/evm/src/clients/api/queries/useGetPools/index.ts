import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import {
  useGetLegacyPoolComptrollerContract,
  useGetPoolLensContract,
  useGetPrimeContract,
  useGetVaiControllerContract,
  useGetVenusLensContract,
} from 'libs/contracts';
import { useGetTokens } from 'libs/tokens';
import { useChainId, useProvider } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow, generatePseudoRandomRefetchInterval } from 'utilities';

import { getPools } from './getPools';
import type { GetPoolsInput, GetPoolsOutput } from './types';

type TrimmedInput = Omit<
  GetPoolsInput,
  | 'chainId'
  | 'xvs'
  | 'tokens'
  | 'provider'
  | 'primeContract'
  | 'poolLensContract'
  | 'blocksPerDay'
  | 'poolLensContract'
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
  const { provider } = useProvider();
  const { chainId } = useChainId();
  const tokens = useGetTokens();

  const primeContract = useGetPrimeContract();
  const poolLensContract = useGetPoolLensContract();
  const legacyPoolComptrollerContract = useGetLegacyPoolComptrollerContract();
  const venusLensContract = useGetVenusLensContract();
  const vaiControllerContract = useGetVaiControllerContract();

  return useQuery({
    queryKey: [FunctionKey.GET_POOLS, { ...input, chainId, accountAddress }],
    queryFn: () =>
      callOrThrow({ poolLensContract }, params =>
        getPools({
          chainId,
          provider,
          tokens,
          legacyPoolComptrollerContract,
          venusLensContract,
          vaiControllerContract,
          primeContract: isPrimeEnabled ? primeContract : undefined,
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
