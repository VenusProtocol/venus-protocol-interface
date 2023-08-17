import { MutationObserverOptions, useMutation } from 'react-query';
import { VToken } from 'types';
import { callOrThrow, convertWeiToTokens } from 'utilities';

import supply, { SupplyInput, SupplyOutput } from 'clients/api/mutations/supply';
import queryClient from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { useAnalytics } from 'context/Analytics';
import { useAuth } from 'context/AuthContext';

type TrimmedSupplyInput = Omit<SupplyInput, 'vToken' | 'signer'>;
type Options = MutationObserverOptions<SupplyOutput, Error, TrimmedSupplyInput>;

const useSupply = (
  { vToken, poolName }: { vToken: VToken; poolName: string },
  options?: Options,
) => {
  const { signer, accountAddress } = useAuth();
  const { captureAnalyticEvent } = useAnalytics();

  return useMutation(
    FunctionKey.SUPPLY,
    (input: TrimmedSupplyInput) =>
      callOrThrow({ signer }, params =>
        supply({
          vToken,
          ...params,
          ...input,
        }),
      ),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        const { amountWei } = onSuccessParams[1];

        captureAnalyticEvent('Tokens supplied', {
          poolName,
          tokenSymbol: vToken.underlyingToken.symbol,
          tokenAmountTokens: convertWeiToTokens({
            token: vToken.underlyingToken,
            valueWei: amountWei,
          }).toNumber(),
        });

        queryClient.invalidateQueries([
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            tokenAddress: vToken.underlyingToken.address,
            accountAddress,
          },
        ]);

        queryClient.invalidateQueries([
          FunctionKey.GET_V_TOKEN_BALANCE,
          {
            accountAddress,
            vTokenAddress: vToken.address,
          },
        ]);

        queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
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
