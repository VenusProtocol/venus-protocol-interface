import { useMutation, MutationObserverOptions } from 'react-query';

import { convertVrt, IConvertVrtInput, ConvertVrtOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useVrtConverterProxyContract } from 'clients/contracts/hooks';

const useConvertVrt = (
  options?: MutationObserverOptions<
    ConvertVrtOutput,
    Error,
    Omit<IConvertVrtInput, 'vrtConverterContract'>
  >,
) => {
  const vrtConverterContract = useVrtConverterProxyContract();
  return useMutation(
    FunctionKey.CONVERT_VRT,
    params =>
      convertVrt({
        vrtConverterContract,
        ...params,
      }),
    {
      ...options,
    },
  );
};

export default useConvertVrt;
