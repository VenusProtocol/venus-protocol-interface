import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import type { ChainId } from '@venusprotocol/chains';
import getVrtConversionEndTime, {
  type GetVrtConversionEndTimeOutput,
} from 'clients/api/queries/getVrtConversionEndTime';
import FunctionKey from 'constants/functionKey';
import { useGetVrtConverterContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
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

const useGetVrtConversionEndTimeIndex = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const vrtConverterContract = useGetVrtConverterContract();

  return useQuery({
    queryKey: [FunctionKey.GET_VRT_CONVERSION_END_TIME, { chainId }],
    queryFn: () => callOrThrow({ vrtConverterContract }, getVrtConversionEndTime),
    ...options,
  });
};

export default useGetVrtConversionEndTimeIndex;
