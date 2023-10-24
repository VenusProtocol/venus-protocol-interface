import {
  useGetMainPoolComptrollerContract,
  useGetPrimeContract,
  useGetResilientOracleContract,
  useGetVaiControllerContract,
  useGetVenusLensContract,
} from 'packages/contracts';
import { useGetToken, useGetTokens } from 'packages/tokens';
import { QueryObserverOptions, useQuery } from 'react-query';
import { useTranslation } from 'translation';
import { callOrThrow, generatePseudoRandomRefetchInterval } from 'utilities';

import getMainPool, { GetMainPoolInput, GetMainPoolOutput } from 'clients/api/queries/getMainPool';
import FunctionKey from 'constants/functionKey';

type TrimmedInput = Omit<
  GetMainPoolInput,
  | 'provider'
  | 'name'
  | 'description'
  | 'venusLensContract'
  | 'mainPoolComptrollerContract'
  | 'resilientOracleContract'
  | 'vaiControllerContract'
  | 'vai'
  | 'xvs'
  | 'tokens'
>;

type Options = QueryObserverOptions<
  GetMainPoolOutput,
  Error,
  GetMainPoolOutput,
  GetMainPoolOutput,
  [FunctionKey.GET_MAIN_POOL, TrimmedInput]
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

const useGetMainPool = (input: TrimmedInput, options?: Options) => {
  const { t } = useTranslation();

  const xvs = useGetToken({ symbol: 'XVS' });
  const vai = useGetToken({ symbol: 'VAI' });
  const tokens = useGetTokens();

  const mainPoolComptrollerContract = useGetMainPoolComptrollerContract();
  const venusLensContract = useGetVenusLensContract();
  const resilientOracleContract = useGetResilientOracleContract();
  const vaiControllerContract = useGetVaiControllerContract();
  const primeContract = useGetPrimeContract();

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
            tokens,
            primeContract,
            ...input,
            ...params,
          }),
      ),
    {
      refetchInterval,
      ...options,
    },
  );
};

export default useGetMainPool;
