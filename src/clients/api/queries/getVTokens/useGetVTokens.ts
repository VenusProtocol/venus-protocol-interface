import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

import getVTokens, { GetVTokensOutput } from 'clients/api/queries/getVTokens';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';
import useGetUniqueContract from 'hooks/useGetUniqueContract';
import useGetUniqueContractAddress from 'hooks/useGetUniqueContractAddress';

export type UseGetVTokensQueryKey = [
  FunctionKey.GET_VTOKENS,
  {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetVTokensOutput,
  Error,
  GetVTokensOutput,
  GetVTokensOutput,
  UseGetVTokensQueryKey
>;

const useGetVTokens = (options?: Options) => {
  const { chainId } = useAuth();

  const venusLensContract = useGetUniqueContract({
    name: 'venusLens',
  });

  const mainPoolComptrollerContract = useGetUniqueContract({
    name: 'mainPoolComptroller',
  });

  const poolLensContract = useGetUniqueContract({
    name: 'poolLens',
  });

  const poolRegistryContractAddress = useGetUniqueContractAddress({
    name: 'poolRegistry',
  });

  return useQuery(
    [
      FunctionKey.GET_VTOKENS,
      {
        chainId,
      },
    ],
    () =>
      callOrThrow(
        { mainPoolComptrollerContract, poolLensContract, poolRegistryContractAddress },
        params =>
          getVTokens({
            venusLensContract,
            ...params,
          }),
      ),
    options,
  );
};

export default useGetVTokens;
