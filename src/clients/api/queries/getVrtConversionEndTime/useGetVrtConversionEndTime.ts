import { useGetVrtConverterContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

import getVrtConversionEndTime, {
  GetVrtConversionEndTimeOutput,
} from 'clients/api/queries/getVrtConversionEndTime';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

export type UseGetVrtConversionEndTimeIndexQueryIndex = [
  FunctionKey.GET_VRT_CONVERSION_END_TIME,
  { chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetVrtConversionEndTimeOutput,
  Error,
  GetVrtConversionEndTimeOutput,
  GetVrtConversionEndTimeOutput,
  UseGetVrtConversionEndTimeIndexQueryIndex
>;

const useGetVrtConversionEndTimeIndex = (options?: Options) => {
  const { chainId } = useAuth();
  const vrtConverterContract = useGetVrtConverterContract();

  return useQuery(
    [FunctionKey.GET_VRT_CONVERSION_END_TIME, { chainId }],
    () => callOrThrow({ vrtConverterContract }, getVrtConversionEndTime),
    options,
  );
};

export default useGetVrtConversionEndTimeIndex;
