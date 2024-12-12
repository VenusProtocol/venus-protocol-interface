import { type QueryObserverOptions, keepPreviousData, useQuery } from '@tanstack/react-query';

import getLegacyPool, {
  type GetLegacyPoolInput,
  type GetLegacyPoolOutput,
} from 'clients/api/queries/getLegacyPool';
import FunctionKey from 'constants/functionKey';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import {
  useGetLegacyPoolComptrollerContract,
  useGetPrimeContract,
  useGetResilientOracleContract,
  useGetVaiControllerContract,
  useGetVenusLensContract,
} from 'libs/contracts';
import { useGetToken, useGetTokens } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow, generatePseudoRandomRefetchInterval } from 'utilities';
import useGetApiPools from '../getApiPools/useGetApiPools';

type TrimmedInput = Omit<
  GetLegacyPoolInput,
  | 'chainId'
  | 'blocksPerDay'
  | 'provider'
  | 'name'
  | 'description'
  | 'venusLensContract'
  | 'legacyPoolComptrollerContract'
  | 'resilientOracleContract'
  | 'vaiControllerContract'
  | 'vTreasuryContractAddress'
  | 'vai'
  | 'xvs'
  | 'tokens'
  | 'legacyPoolData'
>;

export type UseGetLegacyPoolQueryKey = [
  FunctionKey.GET_LEGACY_POOL,
  TrimmedInput & { chainId: ChainId },
  additionalQueryKey?: 'PrimeCalculator',
];

type Options = QueryObserverOptions<
  GetLegacyPoolOutput,
  Error,
  GetLegacyPoolOutput,
  GetLegacyPoolOutput,
  UseGetLegacyPoolQueryKey
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

const useGetLegacyPool = (input?: TrimmedInput, options?: Partial<Options>) => {
  const { data: apiPoolsData } = useGetApiPools();
  const { chainId } = useChainId();
  const { blocksPerDay } = useGetChainMetadata();

  const { t } = useTranslation();

  const xvs = useGetToken({ symbol: 'XVS' });
  const vai = useGetToken({ symbol: 'VAI' });
  const tokens = useGetTokens();
  const isPrimeEnabled = useIsFeatureEnabled({
    name: 'prime',
  });

  const legacyPoolComptrollerContract = useGetLegacyPoolComptrollerContract();
  const venusLensContract = useGetVenusLensContract();
  const resilientOracleContract = useGetResilientOracleContract();
  const vaiControllerContract = useGetVaiControllerContract();
  const primeContract = useGetPrimeContract();

  const isQueryEnabled =
    !!legacyPoolComptrollerContract &&
    !!venusLensContract &&
    !!vai &&
    !!vaiControllerContract &&
    apiPoolsData !== undefined &&
    (options?.enabled === undefined || options?.enabled);

  return useQuery({
    queryKey: [FunctionKey.GET_LEGACY_POOL, { ...input, chainId }],
    queryFn: () =>
      callOrThrow(
        {
          xvs,
          legacyPoolComptrollerContract,
          venusLensContract,
          resilientOracleContract,
          vai,
          vaiControllerContract,
          blocksPerDay,
          legacyPoolData: (apiPoolsData?.pools || []).find(p => !p.isIsolated),
        },
        params =>
          getLegacyPool({
            chainId,
            name: t('legacyPool.name'),
            description: t('legacyPool.description'),
            tokens,
            primeContract: isPrimeEnabled ? primeContract : undefined,
            ...input,
            ...params,
          }),
      ),
    refetchInterval,
    placeholderData: keepPreviousData,
    ...options,
    enabled: isQueryEnabled,
  });
};

export default useGetLegacyPool;
