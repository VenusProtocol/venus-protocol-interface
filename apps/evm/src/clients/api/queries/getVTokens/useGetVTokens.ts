import { type QueryObserverOptions, useQuery } from 'react-query';

import getVTokens, { type GetVTokensOutput } from 'clients/api/queries/getVTokens';
import FunctionKey from 'constants/functionKey';
import {
  useGetLegacyPoolComptrollerContract,
  useGetPoolLensContract,
  useGetPoolRegistryContractAddress,
  useGetVenusLensContract,
} from 'libs/contracts';
import { useGetTokens } from 'libs/tokens';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

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
  const { chainId } = useChainId();
  const tokens = useGetTokens();

  const venusLensContract = useGetVenusLensContract();
  const legacyPoolComptrollerContract = useGetLegacyPoolComptrollerContract();
  const poolLensContract = useGetPoolLensContract();
  const poolRegistryContractAddress = useGetPoolRegistryContractAddress();

  return useQuery(
    [
      FunctionKey.GET_VTOKENS,
      {
        chainId,
      },
    ],
    () =>
      callOrThrow({ poolLensContract, poolRegistryContractAddress }, params =>
        getVTokens({
          chainId,
          legacyPoolComptrollerContract,
          venusLensContract,
          tokens,
          ...params,
        }),
      ),
    options,
  );
};

export default useGetVTokens;
