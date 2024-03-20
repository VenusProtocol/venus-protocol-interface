import supply, {
  type SupplyMutationInput,
  type WrapAndSupplyMutationInput,
} from 'clients/api/mutations/supply';
import queryClient from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { getNativeTokenGatewayContractAddress } from 'libs/contracts';
import { useSigner } from 'libs/wallet';
import type { VToken } from 'types';
import { callOrThrow, convertMantissaToTokens } from 'utilities';

type TrimmedSupplyInput =
  | Omit<SupplyMutationInput, 'vToken' | 'signer'>
  | Omit<WrapAndSupplyMutationInput, 'vToken' | 'signer'>;
type Options = UseSendTransactionOptions<TrimmedSupplyInput>;

const useSupply = (
  { vToken, poolName }: { vToken: VToken; poolName: string },
  options?: Options,
) => {
  const { signer } = useSigner();
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fnKey: FunctionKey.SUPPLY,
    fn: (input: TrimmedSupplyInput) =>
      callOrThrow({ signer }, params =>
        supply(
          input.wrap
            ? {
                ...params,
                ...input,
              }
            : {
                vToken,
                ...params,
                ...input,
              },
        ),
      ),
    onConfirmed: async ({ input }) => {
      captureAnalyticEvent('Tokens supplied', {
        poolName,
        tokenSymbol: vToken.underlyingToken.symbol,
        tokenAmountTokens: convertMantissaToTokens({
          token: vToken.underlyingToken,
          value: input.amountMantissa,
        }).toNumber(),
      });

      const chainId = await signer?.getChainId();
      const accountAddress = await signer?.getAddress();

      queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
      queryClient.invalidateQueries(FunctionKey.GET_MAIN_MARKETS);
      queryClient.invalidateQueries(FunctionKey.GET_LEGACY_POOL);
      queryClient.invalidateQueries(FunctionKey.GET_ISOLATED_POOLS);

      queryClient.invalidateQueries([
        FunctionKey.GET_TOKEN_BALANCES,
        {
          chainId,
          accountAddress,
        },
      ]);

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

      queryClient.invalidateQueries([
        FunctionKey.GET_BALANCE_OF,
        {
          chainId,
          accountAddress,
          tokenAddress: vToken.underlyingToken.address,
        },
      ]);

      if (input.wrap && input.poolComptrollerContractAddress && input && chainId) {
        const nativeTokenGatewayContractAddress = getNativeTokenGatewayContractAddress({
          comptrollerContractAddress: input.poolComptrollerContractAddress,
          chainId,
        });

        queryClient.invalidateQueries([
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            chainId,
            tokenAddress: vToken.underlyingToken.address,
            accountAddress,
            spenderAddress: nativeTokenGatewayContractAddress,
          },
        ]);
      }

      if (input.wrap && vToken.underlyingToken.tokenWrapped) {
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress,
            tokenAddress: vToken.underlyingToken.tokenWrapped?.address,
          },
        ]);
      }
    },
    options,
  });
};

export default useSupply;
