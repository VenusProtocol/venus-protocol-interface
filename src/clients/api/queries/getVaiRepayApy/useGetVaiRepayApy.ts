import { useGetVaiControllerContract } from 'packages/contractsNew';
import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getVaiRepayApy, { GetVaiRepayApyOutput } from 'clients/api/queries/getVaiRepayApy';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVaiRepayApyOutput | undefined,
  Error,
  GetVaiRepayApyOutput | undefined,
  GetVaiRepayApyOutput | undefined,
  FunctionKey.GET_VAI_REPAY_APY
>;

const useGetVaiRepayApy = (options?: Options) => {
  const vaiControllerContract = useGetVaiControllerContract();

  return useQuery(
    FunctionKey.GET_VAI_REPAY_APY,
    () => callOrThrow({ vaiControllerContract }, getVaiRepayApy),
    options,
  );
};

export default useGetVaiRepayApy;
