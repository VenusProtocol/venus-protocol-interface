import { QueryObserverOptions, useQuery } from 'react-query';

import getVaiTreasuryPercentage, {
  IGetVaiTreasuryPercentageOutput,
} from 'clients/api/queries/getVaiTreasuryPercentage';
import FunctionKey from 'constants/functionKey';
import { useVaiUnitroller } from 'hooks/useContract';

type Options = QueryObserverOptions<IGetVaiTreasuryPercentageOutput, Error>;

const useGetVaiTreasuryPercentage = (options: Options) => {
  const vaiControllerContract = useVaiUnitroller();

  return useQuery<IGetVaiTreasuryPercentageOutput, Error>(
    FunctionKey.GET_VAI_TREASURY_PERCENTAGE,
    () => getVaiTreasuryPercentage({ vaiControllerContract }),
    options,
  );
};

export default useGetVaiTreasuryPercentage;
