import { QueryObserverOptions, useQuery } from 'react-query';

import { GetVaiTreasuryPercentageOutput, getVaiTreasuryPercentage } from 'clients/api';
import { useVaiControllerContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVaiTreasuryPercentageOutput,
  Error,
  GetVaiTreasuryPercentageOutput,
  GetVaiTreasuryPercentageOutput,
  FunctionKey.GET_VAI_TREASURY_PERCENTAGE
>;

const useGetVaiTreasuryPercentage = (options?: Options) => {
  const vaiControllerContract = useVaiControllerContract();

  return useQuery(
    FunctionKey.GET_VAI_TREASURY_PERCENTAGE,
    () => getVaiTreasuryPercentage({ vaiControllerContract }),
    options,
  );
};

export default useGetVaiTreasuryPercentage;
