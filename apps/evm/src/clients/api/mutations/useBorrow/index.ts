import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import {
  getNativeTokenGatewayContractAddress,
  nativeTokenGatewayAbi,
  vBep20Abi,
} from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId, usePublicClient } from 'libs/wallet';
import type { VToken } from 'types';
import { convertMantissaToTokens } from 'utilities';
import type { AccessList, Account, Address, Chain, WriteContractParameters } from 'viem';

type BorrowInput = {
  vToken: VToken;
  poolName: string;
  poolComptrollerAddress: Address;
  amountMantissa: bigint;
  unwrap: boolean;
};
type Options = UseSendTransactionOptions<BorrowInput>;

export const useBorrow = (options?: Partial<Options>) => {
  const { captureAnalyticEvent } = useAnalytics();
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { publicClient } = usePublicClient();

  return useSendTransaction({
    fn: async ({ poolComptrollerAddress, unwrap, amountMantissa, vToken }: BorrowInput) => {
      const nativeTokenGatewayContractAddress = getNativeTokenGatewayContractAddress({
        comptrollerContractAddress: poolComptrollerAddress,
        chainId,
      });

      // Handle borrow and unwrap flow
      if (unwrap && !nativeTokenGatewayContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      if (unwrap && nativeTokenGatewayContractAddress) {
        return {
          abi: nativeTokenGatewayAbi,
          address: nativeTokenGatewayContractAddress,
          functionName: 'borrowAndUnwrap',
          args: [amountMantissa],
        } as WriteContractParameters<
          readonly unknown[],
          string,
          readonly unknown[],
          Chain,
          Account
        >;
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

      // Handle borrow flow
      return {
        abi: vBep20Abi,
        address: vToken.address,
        functionName: 'borrow',
        args: [amountMantissa],
        accessList,
      } as WriteContractParameters<readonly unknown[], string, readonly unknown[], Chain, Account>;
    },
    onConfirmed: async ({ input }) => {
      captureAnalyticEvent('Tokens borrowed', {
        poolName: input.poolName,
        tokenSymbol: input.vToken.underlyingToken.symbol,
        tokenAmountTokens: convertMantissaToTokens({
          token: input.vToken.underlyingToken,
          value: input.amountMantissa,
        }).toNumber(),
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
            vTokenAddress: input.vToken.underlyingToken.address,
          },
        ],
      });

      if (input.unwrap && input.vToken.underlyingToken.tokenWrapped) {
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

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_POOLS],
      });
    },
    options,
  });
};
