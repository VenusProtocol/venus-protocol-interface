import supply, { type SupplyInput } from 'clients/api/mutations/supply';
import queryClient from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useAccountAddress, useChainId, useSigner } from 'libs/wallet';
import type { VToken } from 'types';
import { callOrThrow, convertMantissaToTokens } from 'utilities';

type TrimmedSupplyInput = Omit<SupplyInput, 'vToken' | 'signer'>;
type Options = UseSendTransactionOptions<TrimmedSupplyInput>;

const useSupply = (
  { vToken, poolName }: { vToken: VToken; poolName: string },
  options?: Options,
) => {
  const { chainId } = useChainId();
  const { signer } = useSigner();
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fnKey: FunctionKey.SUPPLY,
    fn: (input: TrimmedSupplyInput) =>
      callOrThrow({ signer }, params =>
        supply({
          vToken,
          ...params,
          ...input,
        }),
      ),
    onConfirmed: ({ input }) => {
      captureAnalyticEvent('Tokens supplied', {
        poolName,
        tokenSymbol: vToken.underlyingToken.symbol,
        tokenAmountTokens: convertMantissaToTokens({
          token: vToken.underlyingToken,
          value: input.amountMantissa,
        }).toNumber(),
      });

      queryClient.invalidateQueries([
        FunctionKey.GET_TOKEN_ALLOWANCE,
        {
          chainId,
          tokenAddress: vToken.underlyingToken.address,
          accountAddress,
        },
      ]);

      queryClient.invalidateQueries([
        FunctionKey.GET_V_TOKEN_BALANCE,
        {
          chainId,
          accountAddress,
          vTokenAddress: vToken.address,
        },
      ]);

      queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
      queryClient.invalidateQueries(FunctionKey.GET_MAIN_MARKETS);
      queryClient.invalidateQueries(FunctionKey.GET_LEGACY_POOL);
      queryClient.invalidateQueries(FunctionKey.GET_ISOLATED_POOLS);
    },
    options,
  });
};

export default useSupply;
