import type BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { getContractAddress, nativeTokenGatewayAbi, vBep20Abi, vBnbAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';
import type { VToken } from 'types';
import { convertMantissaToTokens } from 'utilities';
import type { Account, Address, Chain, WriteContractParameters } from 'viem';

type BaseInput = {
  poolName: string;
  vToken: VToken;
  amountMantissa: BigNumber;
};

type WrapAndSupplyInput = BaseInput & {
  wrap: true;
  poolComptrollerContractAddress: Address;
};

type SupplyTokensInput = BaseInput & {
  wrap?: false;
};

type SupplyInput = WrapAndSupplyInput | SupplyTokensInput;
type Options = UseSendTransactionOptions<SupplyInput>;

export const useSupply = (options?: Partial<Options>) => {
  const { captureAnalyticEvent } = useAnalytics();

  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();

  return useSendTransaction({
    // @ts-ignore mixing payable and non-payable function calls messes up with the typing of
    // useSendTransaction
    fn: (input: SupplyInput) => {
      if (!accountAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      // Handle wrap and supply flow
      const nativeTokenGatewayContractAddress = input.wrap
        ? getContractAddress({
            name: 'NativeTokenGateway',
            chainId,
            poolComptrollerContractAddress: input.poolComptrollerContractAddress,
          })
        : undefined;

      if (input.wrap && !nativeTokenGatewayContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      if (input.wrap) {
        return {
          abi: nativeTokenGatewayAbi,
          address: nativeTokenGatewayContractAddress!,
          functionName: 'wrapAndSupply',
          args: [accountAddress],
          value: BigInt(input.amountMantissa.toFixed()),
        } as WriteContractParameters<
          typeof nativeTokenGatewayAbi,
          'wrapAndSupply',
          readonly [Address],
          Chain,
          Account
        >;
      }

      // Handle supplying native currency
      if (input.vToken.underlyingToken.isNative) {
        return {
          abi: vBnbAbi,
          address: input.vToken.address,
          functionName: 'mint',
          value: BigInt(input.amountMantissa.toFixed()),
        } as WriteContractParameters<typeof vBnbAbi, 'mint', readonly [], Chain, Account>;
      }

      // Handle supplying tokens
      return {
        abi: vBep20Abi,
        address: input.vToken.address,
        functionName: 'mint',
        args: [BigInt(input.amountMantissa.toFixed())],
      } as WriteContractParameters<typeof vBep20Abi, 'mint', readonly [bigint], Chain, Account>;
    },
    onConfirmed: ({ input }) => {
      captureAnalyticEvent('Tokens supplied', {
        poolName: input.poolName,
        tokenSymbol: input.vToken.underlyingToken.symbol,
        tokenAmountTokens: convertMantissaToTokens({
          token: input.vToken.underlyingToken,
          value: input.amountMantissa,
        }).toNumber(),
      });

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_V_TOKEN_BALANCES_ALL],
      });

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_POOLS],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_TOKEN_BALANCES,
          {
            chainId,
            accountAddress,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            chainId,
            tokenAddress: input.vToken.underlyingToken.address,
            accountAddress,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_V_TOKEN_BALANCE,
          {
            chainId,
            accountAddress,
            vTokenAddress: input.vToken.address,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress,
            tokenAddress: input.vToken.underlyingToken.address,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            chainId,
            tokenAddress: input.vToken.underlyingToken.address,
            accountAddress,
            spenderAddress: input.vToken.address,
          },
        ],
      });

      if (input.wrap && input.poolComptrollerContractAddress) {
        const nativeTokenGatewayContractAddress = getContractAddress({
          name: 'NativeTokenGateway',
          poolComptrollerContractAddress: input.poolComptrollerContractAddress,
          chainId,
        });

        queryClient.invalidateQueries({
          queryKey: [
            FunctionKey.GET_TOKEN_ALLOWANCE,
            {
              chainId,
              tokenAddress: input.vToken.underlyingToken.address,
              accountAddress,
              spenderAddress: nativeTokenGatewayContractAddress,
            },
          ],
        });
      }

      if (input.wrap && input.vToken.underlyingToken.tokenWrapped) {
        queryClient.invalidateQueries({
          queryKey: [
            FunctionKey.GET_BALANCE_OF,
            {
              chainId,
              accountAddress,
              tokenAddress: input.vToken.underlyingToken.tokenWrapped?.address,
            },
          ],
        });
      }
    },
    options,
  });
};
