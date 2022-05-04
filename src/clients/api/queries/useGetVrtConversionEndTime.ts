import { useQuery, QueryObserverOptions } from 'react-query';

import getVrtConversionEndTime, {
  GetVrtConversionEndTimeOutput,
} from 'clients/api/queries/getVrtConversionEndTime';
import FunctionKey from 'constants/functionKey';
import { useVrtConverterProxyContract } from 'clients/contracts/hooks';

type Options = QueryObserverOptions<
  GetVrtConversionEndTimeOutput,
  Error,
  GetVrtConversionEndTimeOutput,
  GetVrtConversionEndTimeOutput,
  FunctionKey.GET_VRT_CONVERSION_END_TIME
>;

const useGetVrtConversionEndTimeIndex = (options?: Options) => {
  const vrtConverterContract = useVrtConverterProxyContract();

  return useQuery(
    FunctionKey.GET_VRT_CONVERSION_END_TIME,
    () => getVrtConversionEndTime({ vrtConverterContract }),
    options,
  );
};

export default useGetVrtConversionEndTimeIndex;
