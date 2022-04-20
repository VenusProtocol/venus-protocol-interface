import { useMutation, MutationObserverOptions } from 'react-query';
import { queryClient, supply, ISupplyInput, SupplyOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useTokenContract } from 'clients/contracts/hooks';

const useSupplyBnb = (
  // TODO: use custom error type https://app.clickup.com/t/2rvwhnt
  options?: MutationObserverOptions<SupplyOutput, Error, Omit<ISupplyInput, 'tokenContract'>>,
) => {
  const vBnbContract = useTokenContract<'bnb'>('bnb');
  return useMutation(
    [FunctionKey.SUPPLY_BNB],
    params =>
      supply({
        tokenContract: vBnbContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        queryClient.invalidateQueries(FunctionKey.GET_VTOKEN_BALANCES_ALL);
        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useSupplyBnb;
