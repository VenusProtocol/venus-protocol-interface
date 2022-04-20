import { useMutation, MutationObserverOptions } from 'react-query';
import { Bep20 } from 'types/contracts';
import { TokenId } from 'types';
import { queryClient, supply, ISupplyInput, SupplyOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useTokenContract } from 'clients/contracts/hooks';

const useSupply = (
  { assetId }: { assetId: TokenId },
  // TODO: use custom error type https://app.clickup.com/t/2rvwhnt
  options?: MutationObserverOptions<SupplyOutput, Error, Omit<ISupplyInput, 'tokenContract'>>,
) => {
  const tokenContract = useTokenContract<TokenId>(assetId);
  return useMutation(
    [FunctionKey.SUPPLY, assetId],
    params =>
      supply({
        tokenContract: tokenContract as Bep20,
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

export default useSupply;
