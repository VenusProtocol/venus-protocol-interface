import { MutationObserverOptions, useMutation } from 'react-query';

import supply, { SupplyNonBnbInput, SupplyNonBnbOutput } from 'clients/api/mutations/supplyNonBnb';
import queryClient from 'clients/api/queryClient';
import { useVTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { VBep20 } from 'types/contracts';

export type SupplyNonBnbParams = Omit<SupplyNonBnbInput, 'tokenContract' | 'account'>;

const useSupply = (
  { assetId, account }: { assetId: string; account: string },
  // TODO: use custom error type https://app.clickup.com/t/2rvwhnt
  options?: MutationObserverOptions<SupplyNonBnbOutput, Error, SupplyNonBnbParams>,
) => {
  const tokenContract = useVTokenContract<string>(assetId);

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
        queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
        queryClient.invalidateQueries([
          FunctionKey.GET_V_TOKEN_BALANCE,
          {
            accountAddress: account,
            vTokenId: assetId,
          },
        ]);
        queryClient.invalidateQueries(FunctionKey.GET_ASSETS_IN_ACCOUNT);
        queryClient.invalidateQueries(FunctionKey.GET_MARKETS);
        queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_DAILY_XVS);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useSupply;
