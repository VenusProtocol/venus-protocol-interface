import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import { type GetVenusVaiVaultDailyRateOutput, getVenusVaiVaultDailyRate } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useGetLegacyPoolComptrollerContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

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

const useGetVenusVaiVaultDailyRate = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { blocksPerDay } = useGetChainMetadata();
  const legacyPoolComptrollerContract = useGetLegacyPoolComptrollerContract();

  return useQuery({
    queryKey: [FunctionKey.GET_VENUS_VAI_VAULT_DAILY_RATE, { chainId }],
    queryFn: () =>
      callOrThrow({ legacyPoolComptrollerContract, blocksPerDay }, getVenusVaiVaultDailyRate),
    ...options,

    enabled:
      !!legacyPoolComptrollerContract && (options?.enabled === undefined || options?.enabled),
  });
};

export default useGetVenusVaiVaultDailyRate;
