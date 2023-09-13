import { QueryObserverOptions, useQuery } from 'react-query';
import { useTranslation } from 'translation';
import { VenusTokenSymbol } from 'types';
import { callOrThrow } from 'utilities';

import getMainPool, { GetMainPoolInput, GetMainPoolOutput } from 'clients/api/queries/getMainPool';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';
import useGetToken from 'hooks/useGetToken';
import useGetUniqueContract from 'hooks/useGetUniqueContract';

type TrimmedInput = Omit<
  GetMainPoolInput,
  | 'provider'
  | 'name'
  | 'description'
  | 'venusLensContract'
  | 'mainPoolComptrollerContract'
  | 'resilientOracleContract'
  | 'vaiControllerContract'
>;

type Options = QueryObserverOptions<
  GetMainPoolOutput,
  Error,
  GetMainPoolOutput,
  GetMainPoolOutput,
  [FunctionKey.GET_MAIN_POOL, TrimmedInput]
>;

const useGetMainPool = (input: TrimmedInput, options?: Options) => {
  const { t } = useTranslation();

  const xvs = useGetToken({ symbol: VenusTokenSymbol.XVS });
  const vai = useGetToken({ symbol: VenusTokenSymbol.VAI });

  const mainPoolComptrollerContract = useGetUniqueContract({
    name: 'mainPoolComptroller',
  });

  const venusLensContract = useGetUniqueContract({
    name: 'venusLens',
  });

  const resilientOracleContract = useGetUniqueContract({
    name: 'resilientOracle',
  });

  const vaiControllerContract = useGetUniqueContract({
    name: 'vaiController',
  });

  return useQuery(
    [FunctionKey.GET_MAIN_POOL, input],
    () =>
      callOrThrow(
        {
          xvs,
          vai,
          mainPoolComptrollerContract,
          venusLensContract,
          resilientOracleContract,
          vaiControllerContract,
        },
        params =>
          getMainPool({
            name: t('mainPool.name'),
            description: t('mainPool.description'),
            ...input,
            ...params,
          }),
      ),
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      ...options,
    },
  );
};

export default useGetMainPool;
