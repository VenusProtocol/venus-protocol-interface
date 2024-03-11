import { type QueryObserverOptions, useQuery } from 'react-query';

import getVrtConversionEndTime, {
  type GetVrtConversionEndTimeOutput,
} from 'clients/api/queries/getVrtConversionEndTime';
import FunctionKey from 'constants/functionKey';
import { useGetVrtConverterContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

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
  const { chainId } = useChainId();
  const vrtConverterContract = useGetVrtConverterContract();

  return useQuery(
    [FunctionKey.GET_VRT_CONVERSION_END_TIME, { chainId }],
    () => callOrThrow({ vrtConverterContract }, getVrtConversionEndTime),
    options,
  );
};

export default useGetVrtConversionEndTimeIndex;
