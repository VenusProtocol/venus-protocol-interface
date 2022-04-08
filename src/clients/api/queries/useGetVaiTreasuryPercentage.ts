import { QueryObserverOptions, useQuery } from 'react-query';

import { getVaiTreasuryPercentage, GetVaiTreasuryPercentageOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useVaiUnitroller } from 'hooks/useContract';

type Options = QueryObserverOptions<
  GetVaiTreasuryPercentageOutput,
  Error,
  GetVaiTreasuryPercentageOutput,
  GetVaiTreasuryPercentageOutput,
  FunctionKey.GET_VAI_TREASURY_PERCENTAGE
>;

const useGetVaiTreasuryPercentage = (options?: Options) => {
  const vaiControllerContract = useVaiUnitroller();

  return useQuery(
    FunctionKey.GET_VAI_TREASURY_PERCENTAGE,
    () => getVaiTreasuryPercentage({ vaiControllerContract }),
    options,
  );
};

export default useGetVaiTreasuryPercentage;
