import { MutationObserverOptions, useMutation } from 'react-query';

import supplyBnb, { SupplyBnbInput, SupplyBnbOutput } from 'clients/api/mutations/supplyBnb';
import queryClient from 'clients/api/queryClient';
import { useVTokenContract } from 'clients/contracts/hooks';
import { useWeb3 } from 'clients/web3';
import FunctionKey from 'constants/functionKey';
import { VBnbToken } from 'types/contracts';

export type SupplyBnbParams = Omit<SupplyBnbInput, 'tokenContract' | 'account' | 'web3'>;

const useSupplyBnb = (
  { account }: { account: string },
  // TODO: use custom error type https://app.clickup.com/t/2rvwhnt
  options?: MutationObserverOptions<SupplyBnbOutput, Error, SupplyBnbParams>,
) => {
  const vBnbContract = useVTokenContract<'bnb'>('bnb');
  const web3 = useWeb3();
  return useMutation(
    FunctionKey.SUPPLY_BNB,
    params =>
      supplyBnb({
        tokenContract: vBnbContract as VBnbToken,
        web3,
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
            vTokenId: 'bnb',
          },
        ]);
        queryClient.invalidateQueries(FunctionKey.GET_ASSETS_IN_ACCOUNT);
        queryClient.invalidateQueries(FunctionKey.GET_MARKETS);
        queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_DAILY_XVS_WEI);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useSupplyBnb;
