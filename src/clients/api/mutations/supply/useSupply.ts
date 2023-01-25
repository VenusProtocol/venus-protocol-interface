import { MutationObserverOptions, useMutation } from 'react-query';
import { VToken } from 'types';

import supply, { SupplyInput, SupplyOutput } from 'clients/api/mutations/supply';
import queryClient from 'clients/api/queryClient';
import { useAuth } from 'clients/web3';
import FunctionKey from 'constants/functionKey';

type Options = MutationObserverOptions<SupplyOutput, Error, Omit<SupplyInput, 'vToken' | 'signer'>>;

const useSupply = ({ vToken }: { vToken: VToken }, options?: Options) => {
  const { signer, accountAddress } = useAuth();

  return useMutation(
    FunctionKey.SUPPLY,
    params =>
      supply({
        vToken,
        signer,
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
        queryClient.invalidateQueries(FunctionKey.GET_MAIN_MARKETS);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useSupply;
