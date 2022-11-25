import { MutationObserverOptions, useMutation } from 'react-query';
import { Token } from 'types';

import supply, { SupplyInput, SupplyOutput } from 'clients/api/mutations/supply';
import queryClient from 'clients/api/queryClient';
import { useWeb3 } from 'clients/web3';
import FunctionKey from 'constants/functionKey';

export type SupplyParams = Omit<SupplyInput, 'tokenContract' | 'accountAddress' | 'web3'>;

const useSupply = (
  { vToken, accountAddress }: { vToken: Token; accountAddress: string },
  // TODO: use custom error type https://app.clickup.com/t/2rvwhnt
  options?: MutationObserverOptions<SupplyOutput, Error, Omit<SupplyParams, 'vToken'>>,
) => {
  const web3 = useWeb3();

  return useMutation(
    FunctionKey.SUPPLY,
    params =>
      supply({
        vToken,
        web3,
        accountAddress,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
        queryClient.invalidateQueries([
          FunctionKey.GET_V_TOKEN_BALANCE,
          {
            accountAddress,
            vTokenAddress: vToken.address,
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
