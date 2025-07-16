import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import type { ChainId } from '@venusprotocol/chains';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ImportableProtocol } from 'types';
import type { Address } from 'viem';
import { type GetImportablePositionsOutput, getImportablePositions } from '.';

interface UseGetImportablePositionsInput {
  accountAddress: Address;
}

export type UseGetImportablePositionsQueryKey = [
  FunctionKey.GET_IMPORTABLE_POSITIONS,
  UseGetImportablePositionsInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetImportablePositionsOutput | undefined,
  Error,
  GetImportablePositionsOutput | undefined,
  GetImportablePositionsOutput | undefined,
  UseGetImportablePositionsQueryKey
>;

export const useGetImportablePositions = (
  { accountAddress }: UseGetImportablePositionsInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();

  const { address: aavePoolAddressesProviderContractAddress } = useGetContractAddress({
    name: 'AavePoolAddressesProvider',
  });

  const { address: aaveUiPoolDataProviderContractAddress } = useGetContractAddress({
    name: 'AaveUiPoolDataProvider',
  });

  const isImportPositionsFeatureEnabled = useIsFeatureEnabled({
    name: 'importPositions',
  });

  const isImportAavePositionsFeatureEnabled = useIsFeatureEnabled({
    name: 'importAavePositions',
  });

  const protocols: ImportableProtocol[] = [];

  if (isImportAavePositionsFeatureEnabled) {
    protocols.push('aave');
  }

  return useQuery({
    queryKey: [
      FunctionKey.GET_IMPORTABLE_POSITIONS,
      {
        accountAddress,
        chainId,
      },
    ],
    queryFn: () =>
      getImportablePositions({
        accountAddress,
        publicClient,
        protocols,
        aaveUiPoolDataProviderContractAddress,
        aavePoolAddressesProviderContractAddress,
      }),
    ...options,
    enabled:
      (options?.enabled === undefined || options?.enabled) && isImportPositionsFeatureEnabled,
  });
};
