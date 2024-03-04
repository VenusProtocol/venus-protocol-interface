import { QueryObserverOptions, useQuery } from 'react-query';

import getVaiRepayApr, { GetVaiRepayAprOutput } from 'clients/api/queries/getVaiRepayApr';
import FunctionKey from 'constants/functionKey';
import { useGetVaiControllerContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

export type UseGetVaiRepayAprQueryKey = [FunctionKey.GET_VAI_REPAY_APR, { chainId: ChainId }];

type Options = QueryObserverOptions<
  GetVaiRepayAprOutput | undefined,
  Error,
  GetVaiRepayAprOutput | undefined,
  GetVaiRepayAprOutput | undefined,
  UseGetVaiRepayAprQueryKey
>;

const useGetVaiRepayApr = (options?: Options) => {
  const { chainId } = useChainId();
  const vaiControllerContract = useGetVaiControllerContract();

  return useQuery(
    [FunctionKey.GET_VAI_REPAY_APR, { chainId }],
    () => callOrThrow({ vaiControllerContract }, getVaiRepayApr),
    options,
  );
};

export default useGetVaiRepayApr;
