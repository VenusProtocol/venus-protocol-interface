import { useQuery, QueryObserverOptions } from 'react-query';

import getVrtConversionRatio, {
  GetVrtConversionRatioOutput,
} from 'clients/api/queries/getVrtConversionRatio';
import FunctionKey from 'constants/functionKey';
import { useVrtConverterProxyContract } from 'clients/contracts/hooks';

type Options = QueryObserverOptions<
  GetVrtConversionRatioOutput,
  Error,
  GetVrtConversionRatioOutput,
  GetVrtConversionRatioOutput,
  FunctionKey.GET_VRT_CONVERSION_RATIO
>;

const useGetVrtConversionRatio = (options?: Options) => {
  const vrtConverterContract = useVrtConverterProxyContract();

  return useQuery(
    FunctionKey.GET_VRT_CONVERSION_RATIO,
    () => getVrtConversionRatio({ vrtConverterContract }),
    options,
  );
};

export default useGetVrtConversionRatio;
