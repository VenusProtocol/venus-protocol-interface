import type BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import liquidityHubAbi from 'libs/contracts/config/externalAbis/LiquidityHub.json';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';
import type { LiquidityHub } from 'types';
import { convertMantissaToTokens } from 'utilities';
import type { Account, Address, Chain, WriteContractParameters } from 'viem';

export type WithdrawFromLiquidityHubInput = {
  liquidityHub: LiquidityHub;
  amountMantissa: BigNumber;
  withdrawFullSupply?: boolean;
  userVhTokenBalanceMantissa?: BigNumber;
};

type Options = UseSendTransactionOptions<WithdrawFromLiquidityHubInput>;

export const useWithdrawFromLiquidityHub = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    // @ts-ignore mixing function calls messes up with the typing of useSendTransaction
    fn: (input: WithdrawFromLiquidityHubInput) => {
      if (!accountAddress || (input.withdrawFullSupply && !input.userVhTokenBalanceMantissa)) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      if (input.withdrawFullSupply) {
        const { userVhTokenBalanceMantissa } = input;

        if (!userVhTokenBalanceMantissa) {
          throw new VError({
            type: 'unexpected',
            code: 'somethingWentWrong',
          });
        }

        return {
          abi: liquidityHubAbi,
          address: input.liquidityHub.vhToken.address,
          functionName: 'redeem',
          args: [BigInt(userVhTokenBalanceMantissa.toFixed()), accountAddress, accountAddress],
        } as WriteContractParameters<
          typeof liquidityHubAbi,
          'redeem',
          readonly [bigint, Address, Address],
          Chain,
          Account
        >;
      }

      return {
        abi: liquidityHubAbi,
        address: input.liquidityHub.vhToken.address,
        functionName: 'withdraw',
        args: [BigInt(input.amountMantissa.toFixed()), accountAddress, accountAddress],
      } as WriteContractParameters<
        typeof liquidityHubAbi,
        'withdraw',
        readonly [bigint, Address, Address],
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
        withdrewFullSupply: input.withdrawFullSupply === true,
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
    },
    options,
  });
};
