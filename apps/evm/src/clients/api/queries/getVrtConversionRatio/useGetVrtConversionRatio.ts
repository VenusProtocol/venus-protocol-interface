import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import {
  type GetVrtConversionRatioOutput,
  getVrtConversionRatio,
} from 'clients/api/queries/getVrtConversionRatio';
import FunctionKey from 'constants/functionKey';
import { useGetVrtConverterContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

export type UseGetVrtConversionRatioQueryKey = [
  FunctionKey.GET_VRT_CONVERSION_RATIO,
  { chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetVrtConversionRatioOutput,
  Error,
  GetVrtConversionRatioOutput,
  GetVrtConversionRatioOutput,
  UseGetVrtConversionRatioQueryKey
>;

export const useGetVrtConversionRatio = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const vrtConverterContract = useGetVrtConverterContract();

  return useQuery({
    queryKey: [FunctionKey.GET_VRT_CONVERSION_RATIO, { chainId }],
    queryFn: () => callOrThrow({ vrtConverterContract }, getVrtConversionRatio),
    ...options,
  });
};
