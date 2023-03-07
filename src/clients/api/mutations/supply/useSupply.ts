import { MutationObserverOptions, useMutation } from 'react-query';
import { VToken } from 'types';

import supply, { SupplyInput, SupplyOutput } from 'clients/api/mutations/supply';
import queryClient from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

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
        queryClient.invalidateQueries(FunctionKey.GET_ISOLATED_POOLS);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useSupply;
