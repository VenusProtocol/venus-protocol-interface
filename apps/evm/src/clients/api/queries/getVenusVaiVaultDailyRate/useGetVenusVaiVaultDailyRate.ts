import { type QueryObserverOptions, useQuery } from 'react-query';

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

const useGetVenusVaiVaultDailyRate = (options?: Options) => {
  const { chainId } = useChainId();
  const { blocksPerDay } = useGetChainMetadata();
  const legacyPoolComptrollerContract = useGetLegacyPoolComptrollerContract();

  return useQuery(
    [FunctionKey.GET_VENUS_VAI_VAULT_DAILY_RATE, { chainId }],
    () =>
      callOrThrow({ legacyPoolComptrollerContract }, params =>
        getVenusVaiVaultDailyRate({
          ...params,
          blocksPerDay,
        }),
      ),
    {
      ...options,
      enabled:
        !!legacyPoolComptrollerContract && (options?.enabled === undefined || options?.enabled),
    },
  );
};

export default useGetVenusVaiVaultDailyRate;
