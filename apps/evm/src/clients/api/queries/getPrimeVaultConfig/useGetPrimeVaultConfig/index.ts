import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { usePrimeVersion } from 'hooks/usePrimeVersion';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId, PrimeVersion } from 'types';
import { callOrThrow } from 'utilities';

import { type GetPrimeVaultConfigOutput, getPrimeVaultConfig } from '..';

export type UseGetPrimeVaultConfigQueryKey = [
  FunctionKey.GET_PRIME_VAULT_CONFIG,
  {
    chainId: ChainId;
    primeVersion?: PrimeVersion;
  },
];

type Options = QueryObserverOptions<
  GetPrimeVaultConfigOutput,
  Error,
  GetPrimeVaultConfigOutput,
  GetPrimeVaultConfigOutput,
  UseGetPrimeVaultConfigQueryKey
>;

export const useGetPrimeVaultConfig = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const { primeVersion } = usePrimeVersion();
  const { address: primeV1ContractAddress } = useGetContractAddress({ name: 'Prime' });
  const { address: primeV2ContractAddress } = useGetContractAddress({ name: 'PrimeV2' });

  const primeContractAddress = primeVersion === 1 ? primeV1ContractAddress : primeV2ContractAddress;

  return useQuery({
    queryKey: [FunctionKey.GET_PRIME_VAULT_CONFIG, { chainId, primeVersion }],
    queryFn: () =>
      callOrThrow(
        {
          primeContractAddress,
          primeVersion,
        },
        params => getPrimeVaultConfig({ ...params, publicClient }),
      ),
    ...options,
    enabled: (options?.enabled === undefined || options.enabled) && !!primeVersion,
  });
};
