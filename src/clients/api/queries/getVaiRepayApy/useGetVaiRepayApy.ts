import { QueryObserverOptions, useQuery } from 'react-query';

import getVaiRepayApy, { GetVaiRepayApyOutput } from 'clients/api/queries/getVaiRepayApy';
import { useVaiControllerContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVaiRepayApyOutput,
  Error,
  GetVaiRepayApyOutput,
  GetVaiRepayApyOutput,
  FunctionKey.GET_VAI_REPAY_APY
>;

const useGetVaiRepayApy = (options?: Options) => {
  const vaiControllerContract = useVaiControllerContract();

  return useQuery(
    FunctionKey.GET_VAI_REPAY_APY,
    () => getVaiRepayApy({ vaiControllerContract }),
    options,
  );
};

export default useGetVaiRepayApy;
