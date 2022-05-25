import { useMutation, MutationObserverOptions } from 'react-query';
import { VBnbToken } from 'types/contracts';
import queryClient from 'clients/api/queryClient';
import supplyBnb, { ISupplyBnbInput, SupplyBnbOutput } from 'clients/api/mutations/supplyBnb';
import { useWeb3 } from 'clients/web3';
import { useVTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

export type SupplyBnbParams = Omit<ISupplyBnbInput, 'tokenContract' | 'account' | 'web3'>;

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
        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useSupplyBnb;
