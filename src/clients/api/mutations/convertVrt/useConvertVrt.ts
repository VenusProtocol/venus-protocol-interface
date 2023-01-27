import { MutationObserverOptions, useMutation } from 'react-query';

import { ConvertVrtInput, ConvertVrtOutput, convertVrt, queryClient } from 'clients/api';
import { useVrtConverterProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { TOKENS } from 'constants/tokens';

const useConvertVrt = (
  options?: MutationObserverOptions<
    ConvertVrtOutput,
    Error,
    Omit<ConvertVrtInput, 'vrtConverterContract'>
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
        const accountAddress = await vrtConverterContract.signer.getAddress();

        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            accountAddress,
            tokenAddress: TOKENS.vrt.address,
          },
        ]);

        queryClient.invalidateQueries([
          FunctionKey.GET_V_TOKEN_BALANCE,
          { accountAddress, vTokenAddress: TOKENS.vrt.address },
        ]);

        queryClient.invalidateQueries([
          FunctionKey.GET_TOKEN_BALANCES,
          {
            accountAddress,
          },
        ]);

        queryClient.invalidateQueries([
          FunctionKey.GET_TOKEN_BALANCES,
          {
            accountAddress,
          },
        ]);

        queryClient.invalidateQueries([
          FunctionKey.GET_TOKEN_BALANCES,
          {
            accountAddress,
          },
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useConvertVrt;
