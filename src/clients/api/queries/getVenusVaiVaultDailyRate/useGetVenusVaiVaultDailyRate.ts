import { useGetMainPoolComptrollerContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

import { GetVenusVaiVaultDailyRateOutput, getVenusVaiVaultDailyRate } from 'clients/api';
import { CHAIN_METADATA } from 'constants/chainMetadata';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

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
  const { chainId } = useAuth();
  const { blocksPerDay } = CHAIN_METADATA[chainId];
  const mainPoolComptrollerContract = useGetMainPoolComptrollerContract();

  return useQuery(
    [FunctionKey.GET_VENUS_VAI_VAULT_DAILY_RATE, { chainId }],
    () =>
      callOrThrow({ mainPoolComptrollerContract }, params =>
        getVenusVaiVaultDailyRate({
          ...params,
          blocksPerDay,
        }),
      ),
    options,
  );
};

export default useGetVenusVaiVaultDailyRate;
