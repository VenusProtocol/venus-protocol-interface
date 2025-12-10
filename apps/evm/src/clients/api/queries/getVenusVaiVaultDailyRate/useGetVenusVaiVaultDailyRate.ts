import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import { getBlockTimeByChainId } from '@venusprotocol/chains';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { usePublicClient } from 'libs/wallet';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import { type GetVenusVaiVaultDailyRateOutput, getVenusVaiVaultDailyRate } from '.';

export type UseGetVenusVaiVaultDailyRateQueryKey = [
  FunctionKey.GET_VENUS_VAI_VAULT_DAILY_RATE,
  { chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetVenusVaiVaultDailyRateOutput,
  Error,
  GetVenusVaiVaultDailyRateOutput,
  GetVenusVaiVaultDailyRateOutput,
  UseGetVenusVaiVaultDailyRateQueryKey
>;

export const useGetVenusVaiVaultDailyRate = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { blocksPerDay } = getBlockTimeByChainId({ chainId }) ?? {};
  const { publicClient } = usePublicClient();
  const { address: legacyPoolComptrollerAddress } = useGetContractAddress({
    name: 'LegacyPoolComptroller',
  });

  return useQuery({
    queryKey: [FunctionKey.GET_VENUS_VAI_VAULT_DAILY_RATE, { chainId }],
    queryFn: () =>
      callOrThrow({ legacyPoolComptrollerAddress, blocksPerDay }, params =>
        getVenusVaiVaultDailyRate({ ...params, publicClient }),
      ),
    ...options,
    enabled: !!legacyPoolComptrollerAddress && (options?.enabled === undefined || options?.enabled),
  });
};
