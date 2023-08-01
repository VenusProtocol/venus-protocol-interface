import { QueryObserverOptions, useQuery } from 'react-query';

import { GetVaiTreasuryPercentageOutput, getVaiTreasuryPercentage } from 'clients/api';
import { useGetUniqueContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';
import { logError } from 'context/ErrorLogger';

type Options = QueryObserverOptions<
  GetVaiTreasuryPercentageOutput | undefined,
  Error,
  GetVaiTreasuryPercentageOutput | undefined,
  GetVaiTreasuryPercentageOutput | undefined,
  FunctionKey.GET_VAI_TREASURY_PERCENTAGE
>;

const useGetVaiTreasuryPercentage = (options?: Options) => {
  const vaiControllerContract = useGetUniqueContract({
    name: 'vaiController',
  });

  const handleGetVaiTreasuryPercentage = async () => {
    if (!vaiControllerContract) {
      logError('Contract infos missing for getVaiTreasuryPercentage query function call');
      return undefined;
    }

    return getVaiTreasuryPercentage({ vaiControllerContract });
  };

  return useQuery(FunctionKey.GET_VAI_TREASURY_PERCENTAGE, handleGetVaiTreasuryPercentage, options);
};

export default useGetVaiTreasuryPercentage;
