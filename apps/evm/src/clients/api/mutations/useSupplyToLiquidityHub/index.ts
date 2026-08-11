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

export type SupplyToLiquidityHubInput = {
  liquidityHub: LiquidityHub;
  amountMantissa: BigNumber;
};

type Options = UseSendTransactionOptions<SupplyToLiquidityHubInput>;

export const useSupplyToLiquidityHub = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fn: (input: SupplyToLiquidityHubInput) => {
      if (!accountAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      return {
        abi: liquidityHubAbi,
        address: input.liquidityHub.vhToken.address,
        functionName: 'deposit',
        args: [BigInt(input.amountMantissa.toFixed()), accountAddress],
      } as WriteContractParameters<
        typeof liquidityHubAbi,
        'deposit',
        readonly [bigint, Address],
        Chain,
        Account
      >;
    },
    onConfirmed: ({ input }) => {
      captureAnalyticEvent('Tokens supplied', {
        poolName: 'liquidity_hub',
        tokenSymbol: input.liquidityHub.vhToken.underlyingToken.symbol,
        tokenAmountTokens: convertMantissaToTokens({
          token: input.liquidityHub.vhToken.underlyingToken,
          value: input.amountMantissa,
        }).toNumber(),
        fundingSource: 'wallet',
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
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            chainId,
            tokenAddress: input.liquidityHub.vhToken.underlyingToken.address,
            accountAddress,
            spenderAddress: input.liquidityHub.vhToken.address,
          },
        ],
      });
    },
    options,
  });
};
