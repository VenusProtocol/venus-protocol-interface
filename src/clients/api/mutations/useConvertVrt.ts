import { useMutation, MutationObserverOptions } from 'react-query';

import { queryClient, convertVrt, IConvertVrtInput, ConvertVrtOutput } from 'clients/api';
import { TOKENS } from 'constants/tokens';
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
      onSuccess: async (...onSuccessParams) => {
        const { accountAddress } = onSuccessParams[1];

        queryClient.invalidateQueries([FunctionKey.GET_BALANCE_OF, accountAddress, TOKENS.vrt.id]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useConvertVrt;
