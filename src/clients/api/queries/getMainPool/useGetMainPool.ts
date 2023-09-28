import {
  useGetMainPoolComptrollerContract,
  useGetVaiControllerContract,
} from 'packages/contractsNew';
import { QueryObserverOptions, useQuery } from 'react-query';
import { useTranslation } from 'translation';
import { callOrThrow, generatePseudoRandomRefetchInterval } from 'utilities';

import getMainPool, { GetMainPoolInput, GetMainPoolOutput } from 'clients/api/queries/getMainPool';
import FunctionKey from 'constants/functionKey';
import useGetToken from 'hooks/useGetToken';
import useGetTokens from 'hooks/useGetTokens';
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

  const venusLensContract = useGetUniqueContract({
    name: 'venusLens',
  });

  const resilientOracleContract = useGetUniqueContract({
    name: 'resilientOracle',
  });

  const vaiControllerContract = useGetVaiControllerContract();

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
