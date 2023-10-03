import { useGetVaiControllerContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import { GetVaiTreasuryPercentageOutput, getVaiTreasuryPercentage } from 'clients/api';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVaiTreasuryPercentageOutput | undefined,
  Error,
  GetVaiTreasuryPercentageOutput | undefined,
  GetVaiTreasuryPercentageOutput | undefined,
  FunctionKey.GET_VAI_TREASURY_PERCENTAGE
>;

const useGetVaiTreasuryPercentage = (options?: Options) => {
  const vaiControllerContract = useGetVaiControllerContract();

  return useQuery(
    FunctionKey.GET_VAI_TREASURY_PERCENTAGE,
    () => callOrThrow({ vaiControllerContract }, getVaiTreasuryPercentage),
    options,
  );
};

export default useGetVaiTreasuryPercentage;
