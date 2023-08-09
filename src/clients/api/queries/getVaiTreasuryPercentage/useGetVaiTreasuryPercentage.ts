import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import { GetVaiTreasuryPercentageOutput, getVaiTreasuryPercentage } from 'clients/api';
import { useGetUniqueContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';

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

  return useQuery(
    FunctionKey.GET_VAI_TREASURY_PERCENTAGE,
    () => callOrThrow({ vaiControllerContract }, getVaiTreasuryPercentage),
    options,
  );
};

export default useGetVaiTreasuryPercentage;
