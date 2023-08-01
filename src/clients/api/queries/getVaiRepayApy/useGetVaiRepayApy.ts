import { QueryObserverOptions, useQuery } from 'react-query';

import getVaiRepayApy, { GetVaiRepayApyOutput } from 'clients/api/queries/getVaiRepayApy';
import { useGetUniqueContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';
import { logError } from 'context/ErrorLogger';

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

  const handleGetVaiRepayApy = async () => {
    if (!vaiControllerContract) {
      logError('Contract infos missing for getVaiRepayApy query function call');
      return undefined;
    }

    return getVaiRepayApy({ vaiControllerContract });
  };

  return useQuery(FunctionKey.GET_VAI_REPAY_APY, handleGetVaiRepayApy, options);
};

export default useGetVaiRepayApy;
