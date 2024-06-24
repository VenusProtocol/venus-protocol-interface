import { type QueryObserverOptions, useQuery } from 'react-query';

import getLegacyPool, {
  type GetLegacyPoolInput,
  type GetLegacyPoolOutput,
} from 'clients/api/queries/getLegacyPool';
import FunctionKey from 'constants/functionKey';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useGetVTreasuryContractAddress } from 'hooks/useGetVTreasuryContractAddress';
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
import { useChainId, useProvider } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow, generatePseudoRandomRefetchInterval } from 'utilities';
import type { GetApiPoolsOutput } from '../getApiPools';

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
> & { apiPoolsData: GetApiPoolsOutput };

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

const useGetLegacyPool = (input: TrimmedInput, options?: Options) => {
  const { apiPoolsData } = input;
  const { provider } = useProvider();
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
  const vTreasuryContractAddress = useGetVTreasuryContractAddress();

  const isQueryEnabled =
    !!legacyPoolComptrollerContract &&
    !!venusLensContract &&
    !!vai &&
    !!vaiControllerContract &&
    !!apiPoolsData &&
    (options?.enabled === undefined || options?.enabled);

  return useQuery(
    [FunctionKey.GET_LEGACY_POOL, { ...input, chainId }],
    () =>
      callOrThrow(
        {
          xvs,
          legacyPoolComptrollerContract,
          venusLensContract,
          resilientOracleContract,
          vTreasuryContractAddress,
          vai,
          vaiControllerContract,
          blocksPerDay,
          legacyPoolData: apiPoolsData.pools.find(p => !p.isIsolated),
        },
        params =>
          getLegacyPool({
            provider,
            chainId,
            name: t('legacyPool.name'),
            description: t('legacyPool.description'),
            tokens,
            primeContract: isPrimeEnabled ? primeContract : undefined,
            ...input,
            ...params,
          }),
      ),
    {
      refetchInterval,
      ...options,
      enabled: isQueryEnabled,
    },
  );
};

export default useGetLegacyPool;
