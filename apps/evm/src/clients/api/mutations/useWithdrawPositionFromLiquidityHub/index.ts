import type BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { collateralGatewayAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';
import type { LiquidityHub, VToken } from 'types';
import { convertMantissaToTokens } from 'utilities';
import {
  type Account,
  type Address,
  type Chain,
  type WriteContractParameters,
  maxUint256,
} from 'viem';

export type WithdrawPositionFromLiquidityHubInput = {
  liquidityHub: LiquidityHub;
  vhMarketVToken: VToken;
  amountMantissa: BigNumber;
  sharesMantissa: BigNumber;
  withdrawFullPosition?: boolean;
};

type Options = UseSendTransactionOptions<WithdrawPositionFromLiquidityHubInput>;

export const useWithdrawPositionFromLiquidityHub = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();
  const { address: collateralGatewayAddress } = useGetContractAddress({
    name: 'CollateralGateway',
  });

  return useSendTransaction({
    fn: (input: WithdrawPositionFromLiquidityHubInput) => {
      if (!accountAddress || !collateralGatewayAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      const shares = input.withdrawFullPosition
        ? maxUint256
        : BigInt(input.sharesMantissa.toFixed());

      return {
        abi: collateralGatewayAbi,
        address: collateralGatewayAddress,
        functionName: 'withdrawPosition',
        args: [input.vhMarketVToken.address, shares, 0n],
      } as WriteContractParameters<
        typeof collateralGatewayAbi,
        'withdrawPosition',
        readonly [Address, bigint, bigint],
        Chain,
        Account
      >;
    },
    onConfirmed: ({ input }) => {
      captureAnalyticEvent('Tokens withdrawn', {
        poolName: 'liquidity_hub',
        tokenSymbol: input.liquidityHub.vhToken.underlyingToken.symbol,
        tokenAmountTokens: convertMantissaToTokens({
          token: input.liquidityHub.vhToken.underlyingToken,
          value: input.amountMantissa,
        }).toNumber(),
        withdrewFullSupply: input.withdrawFullPosition === true,
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_LIQUIDITY_HUB,
          {
            vhTokenAddress: input.liquidityHub.vhToken.address,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_LIQUIDITY_HUBS],
      });

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_POOLS],
      });

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_V_TOKEN_BALANCES_ALL],
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
            tokenAddress: input.liquidityHub.vhToken.underlyingToken.address,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress,
            tokenAddress: input.liquidityHub.vhToken.address,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_V_TOKEN_BALANCE,
          {
            chainId,
            accountAddress,
            vTokenAddress: input.vhMarketVToken.address,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            chainId,
            tokenAddress: input.liquidityHub.vhToken.address,
            accountAddress,
            spenderAddress: collateralGatewayAddress,
          },
        ],
      });
    },
    options,
  });
};
