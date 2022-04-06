import { QueryObserverOptions, useQuery } from 'react-query';

import getVaiTreasuryPercentage, {
  IGetVaiTreasuryPercentageOutput,
} from 'clients/api/queries/getVaiTreasuryPercentage';
import FunctionKey from 'constants/functionKey';
import { useVaiUnitroller } from 'hooks/useContract';

type Options = QueryObserverOptions<
  IGetVaiTreasuryPercentageOutput,
  Error,
  IGetVaiTreasuryPercentageOutput,
  IGetVaiTreasuryPercentageOutput,
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
