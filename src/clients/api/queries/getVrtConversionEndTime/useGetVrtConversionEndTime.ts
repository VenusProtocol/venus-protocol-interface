import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getVrtConversionEndTime, {
  GetVrtConversionEndTimeOutput,
} from 'clients/api/queries/getVrtConversionEndTime';
import FunctionKey from 'constants/functionKey';
import useGetUniqueContract from 'hooks/useGetUniqueContract';

type Options = QueryObserverOptions<
  GetVrtConversionEndTimeOutput,
  Error,
  GetVrtConversionEndTimeOutput,
  GetVrtConversionEndTimeOutput,
  FunctionKey.GET_VRT_CONVERSION_END_TIME
>;

const useGetVrtConversionEndTimeIndex = (options?: Options) => {
  const vrtConverterContract = useGetUniqueContract({
    name: 'vrtConverter',
  });

  return useQuery(
    FunctionKey.GET_VRT_CONVERSION_END_TIME,
    () => callOrThrow({ vrtConverterContract }, getVrtConversionEndTime),
    options,
  );
};

export default useGetVrtConversionEndTimeIndex;
