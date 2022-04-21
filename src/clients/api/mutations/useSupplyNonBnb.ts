import { useMutation, MutationObserverOptions } from 'react-query';
import { VBep20 } from 'types/contracts';
import { VTokenId } from 'types';
import queryClient from 'clients/api/queryClient';
import supply, { ISupplyInput, SupplyOutput } from 'clients/api/mutations/supplyNonBnb';

import FunctionKey from 'constants/functionKey';
import { useVTokenContract } from 'clients/contracts/hooks';

export type SupplyParams = Omit<ISupplyInput, 'tokenContract' | 'account'>;

const useSupply = (
  { assetId, account }: { assetId: VTokenId; account: string | undefined },
  // TODO: use custom error type https://app.clickup.com/t/2rvwhnt
  options?: MutationObserverOptions<SupplyOutput, Error, SupplyParams>,
) => {
  const tokenContract = useVTokenContract<VTokenId>(assetId);
  return useMutation(
    [FunctionKey.SUPPLY, assetId],
    params =>
      supply({
        tokenContract: tokenContract as VBep20,
        account,
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
