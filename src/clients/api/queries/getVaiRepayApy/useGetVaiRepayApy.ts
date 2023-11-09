import { useGetVaiControllerContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

import getVaiRepayApy, { GetVaiRepayApyOutput } from 'clients/api/queries/getVaiRepayApy';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

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
  const vaiControllerContract = useGetVaiControllerContract();

  return useQuery(
    [FunctionKey.GET_VAI_REPAY_APY, { chainId }],
    () => callOrThrow({ vaiControllerContract }, getVaiRepayApy),
    options,
  );
};

export default useGetVaiRepayApy;
