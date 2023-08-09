import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getVaiRepayApy, { GetVaiRepayApyOutput } from 'clients/api/queries/getVaiRepayApy';
import { useGetUniqueContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVaiRepayApyOutput | undefined,
  Error,
  GetVaiRepayApyOutput | undefined,
  GetVaiRepayApyOutput | undefined,
  FunctionKey.GET_VAI_REPAY_APY
>;

const useGetVaiRepayApy = (options?: Options) => {
  const vaiControllerContract = useGetUniqueContract({
    name: 'vaiController',
  });

  return useQuery(
    FunctionKey.GET_VAI_REPAY_APY,
    () => callOrThrow({ vaiControllerContract }, getVaiRepayApy),
    options,
  );
};

export default useGetVaiRepayApy;
