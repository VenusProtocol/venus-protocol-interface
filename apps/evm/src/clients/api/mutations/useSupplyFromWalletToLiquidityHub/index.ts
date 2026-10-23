import type BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useGetUserSlippageTolerance } from 'hooks/useGetUserSlippageTolerance';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { collateralGatewayAbi } from 'libs/contracts';
import liquidityHubAbi from 'libs/contracts/config/externalAbis/LiquidityHub.json';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId, usePublicClient } from 'libs/wallet';
import type { LiquidityHub, VToken } from 'types';
import { convertMantissaToTokens, subtractSlippageTolerance } from 'utilities';
import type { Account, Address, Chain, WriteContractParameters } from 'viem';

export type SupplyFromWalletToLiquidityHubInput = {
  liquidityHub: LiquidityHub;
  vhMarketVToken: VToken;
  amountMantissa: BigNumber;
};

type Options = UseSendTransactionOptions<SupplyFromWalletToLiquidityHubInput>;

export const useSupplyFromWalletToLiquidityHub = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();
  const { publicClient } = usePublicClient();
  const { userSlippageTolerancePercentage } = useGetUserSlippageTolerance();
  const { address: collateralGatewayAddress } = useGetContractAddress({
    name: 'CollateralGateway',
  });

  return useSendTransaction({
    fn: async (input: SupplyFromWalletToLiquidityHubInput) => {
      if (!accountAddress || !collateralGatewayAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      const amountMantissa = BigInt(input.amountMantissa.toFixed());

      const previewShares = (await publicClient.readContract({
        abi: liquidityHubAbi,
        address: input.liquidityHub.vhToken.address,
        functionName: 'previewDeposit',
        args: [amountMantissa],
      })) as bigint;

      const minShares = subtractSlippageTolerance({
        valueMantissa: previewShares,
        slippageTolerancePercentage: userSlippageTolerancePercentage,
      });

      return {
        abi: collateralGatewayAbi,
        address: collateralGatewayAddress,
        functionName: 'supplyFromWallet',
        args: [amountMantissa, input.vhMarketVToken.address, minShares],
      } as WriteContractParameters<
        typeof collateralGatewayAbi,
        'supplyFromWallet',
        readonly [bigint, Address, bigint],
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
            tokenAddress: input.liquidityHub.vhToken.underlyingToken.address,
            accountAddress,
            spenderAddress: collateralGatewayAddress,
          },
        ],
      });
    },
    options,
  });
};
