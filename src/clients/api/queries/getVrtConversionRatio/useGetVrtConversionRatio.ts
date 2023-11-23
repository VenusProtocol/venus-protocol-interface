import { useGetVrtConverterContract } from 'packages/contracts';
import { useChainId } from 'packages/wallet';
import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

import getVrtConversionRatio, {
  GetVrtConversionRatioOutput,
} from 'clients/api/queries/getVrtConversionRatio';
import FunctionKey from 'constants/functionKey';

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

const useGetVrtConversionRatio = (options?: Options) => {
  const { chainId } = useChainId();
  const vrtConverterContract = useGetVrtConverterContract();

  return useQuery(
    [FunctionKey.GET_VRT_CONVERSION_RATIO, { chainId }],
    () => callOrThrow({ vrtConverterContract }, getVrtConversionRatio),
    options,
  );
};

export default useGetVrtConversionRatio;
