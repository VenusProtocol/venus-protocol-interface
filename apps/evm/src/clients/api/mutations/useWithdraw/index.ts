import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { getContractAddress, nativeTokenGatewayAbi, vBep20Abi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId, usePublicClient } from 'libs/wallet';
import type { VToken } from 'types';
import { convertMantissaToTokens } from 'utilities';
import type { AccessList, Account, Address, Chain, WriteContractParameters } from 'viem';

type WithdrawInput = {
  vToken: VToken;
  amountMantissa: BigNumber;
  poolComptrollerContractAddress: Address;
  poolName: string;
  withdrawFullSupply?: boolean;
  unwrap?: boolean;
};
type Options = UseSendTransactionOptions<WithdrawInput>;

export const useWithdraw = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { captureAnalyticEvent } = useAnalytics();
  const { publicClient } = usePublicClient();
  const { accountAddress } = useAccountAddress();

  return useSendTransaction({
    // @ts-ignore mixing payable and non-payable function calls messes up with the typing of
    // useSendTransaction
    fn: async ({
      vToken,
      poolComptrollerContractAddress,
      amountMantissa,
      withdrawFullSupply,
      unwrap,
    }: WithdrawInput) => {
      if (!accountAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      const nativeTokenGatewayContractAddress = getContractAddress({
        name: 'NativeTokenGateway',
        poolComptrollerContractAddress: poolComptrollerContractAddress,
        chainId,
      });

      // Handle withdraw and unwrap flow
      if (unwrap && !nativeTokenGatewayContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      if (unwrap && nativeTokenGatewayContractAddress) {
        return withdrawFullSupply
          ? ({
              address: nativeTokenGatewayContractAddress,
              abi: nativeTokenGatewayAbi,
              functionName: 'redeemAndUnwrap',
              args: [BigInt(amountMantissa.toFixed())],
            } as WriteContractParameters<
              typeof nativeTokenGatewayAbi,
              'redeemAndUnwrap',
              readonly [bigint],
              Chain,
              Account
            >)
          : ({
              address: nativeTokenGatewayContractAddress,
              abi: nativeTokenGatewayAbi,
              functionName: 'redeemUnderlyingAndUnwrap',
              args: [BigInt(amountMantissa.toFixed())],
            } as WriteContractParameters<
              typeof nativeTokenGatewayAbi,
              'redeemUnderlyingAndUnwrap',
              readonly [bigint],
              Chain,
              Account
            >);
      }

      // Add access list if underlying token is native. This is a workaround for the "transfer" and
      // "send" actions being limited to 2300 gas, which is insufficient post-Berlin fork
      // (EIP-2929). Adding an access list pays the gas ahead, reducing the runtime cost to 100 gas.
      let accessList: AccessList | undefined;

      if (vToken.underlyingToken.isNative) {
        const { accessList: tmpAccessList } = await publicClient.createAccessList({
          data: '0x',
          value: 1n,
          to: accountAddress,
        });

        accessList = tmpAccessList;
      }

      return withdrawFullSupply
        ? ({
            address: vToken.address,
            abi: vBep20Abi,
            functionName: 'redeem',
            args: [BigInt(amountMantissa.toFixed())],
            accessList: accessList?.length ? accessList : undefined,
          } as WriteContractParameters<
            typeof vBep20Abi,
            'redeem',
            readonly [bigint],
            Chain,
            Account
          >)
        : ({
            address: vToken.address,
            abi: vBep20Abi,
            functionName: 'redeemUnderlying',
            args: [BigInt(amountMantissa.toFixed())],
            accessList: accessList?.length ? accessList : undefined,
          } as WriteContractParameters<
            typeof vBep20Abi,
            'redeemUnderlying',
            readonly [bigint],
            Chain,
            Account
          >);
    },
    onConfirmed: async ({ input }) => {
      captureAnalyticEvent('Tokens withdrawn', {
        poolName: input.poolName,
        tokenSymbol: input.vToken.underlyingToken.symbol,
        tokenAmountTokens: convertMantissaToTokens({
          token: input.vToken.underlyingToken,
          value: input.amountMantissa,
        }).toNumber(),
        withdrewFullSupply: false,
      });

      queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_V_TOKEN_BALANCES_ALL] });
      queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_POOLS] });

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
          FunctionKey.GET_TOKEN_BALANCES,
          {
            chainId,
            accountAddress,
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

      if (input.unwrap && input.vToken.underlyingToken.tokenWrapped?.isNative) {
        queryClient.invalidateQueries({
          queryKey: [
            FunctionKey.GET_BALANCE_OF,
            {
              chainId,
              accountAddress,
              tokenAddress: input.vToken.underlyingToken.tokenWrapped.address,
            },
          ],
        });
      }
    },
    options,
  });
};
