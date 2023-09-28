import { useGetVrtConverterContract } from 'packages/contractsNew';
import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getVrtConversionRatio, {
  GetVrtConversionRatioOutput,
} from 'clients/api/queries/getVrtConversionRatio';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVrtConversionRatioOutput,
  Error,
  GetVrtConversionRatioOutput,
  GetVrtConversionRatioOutput,
  FunctionKey.GET_VRT_CONVERSION_RATIO
>;

const useGetVrtConversionRatio = (options?: Options) => {
  const vrtConverterContract = useGetVrtConverterContract();

  return useQuery(
    FunctionKey.GET_VRT_CONVERSION_RATIO,
    () => callOrThrow({ vrtConverterContract }, getVrtConversionRatio),
    options,
  );
};

export default useGetVrtConversionRatio;
