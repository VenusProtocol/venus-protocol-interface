import { useGetVaiControllerContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

import getVaiRepayApy, { GetVaiRepayApyOutput } from 'clients/api/queries/getVaiRepayApy';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';

export type UseGetVaiRepayApyQueryKey = [FunctionKey.GET_VAI_REPAY_APY, { chainId: ChainId }];

type Options = QueryObserverOptions<
  GetVaiRepayApyOutput | undefined,
  Error,
  GetVaiRepayApyOutput | undefined,
  GetVaiRepayApyOutput | undefined,
  UseGetVaiRepayApyQueryKey
>;

const useGetVaiRepayApy = (options?: Options) => {
  const { chainId } = useAuth();
  const { blocksPerDay } = useGetChainMetadata();
  const vaiControllerContract = useGetVaiControllerContract();

  return useQuery(
    [FunctionKey.GET_VAI_REPAY_APY, { chainId }],
    () =>
      callOrThrow({ vaiControllerContract }, params => getVaiRepayApy({ blocksPerDay, ...params })),
    options,
  );
};

export default useGetVaiRepayApy;
