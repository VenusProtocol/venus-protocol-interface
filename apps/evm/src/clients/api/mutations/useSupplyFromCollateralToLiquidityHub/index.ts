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

export type SupplyFromCollateralToLiquidityHubInput = {
  liquidityHub: LiquidityHub;
  vToken: VToken;
  vhMarketVToken: VToken;
  vTokenAmountMantissa: BigNumber;
  underlyingAmountMantissa: BigNumber;
  migrateFullSupply?: boolean;
};

type Options = UseSendTransactionOptions<SupplyFromCollateralToLiquidityHubInput>;

export const useSupplyFromCollateralToLiquidityHub = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();
  const { address: collateralGatewayAddress } = useGetContractAddress({
    name: 'CollateralGateway',
  });

  return useSendTransaction({
    fn: (input: SupplyFromCollateralToLiquidityHubInput) => {
      if (!accountAddress || !collateralGatewayAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      const vTokenAmount = input.migrateFullSupply
        ? maxUint256
        : BigInt(input.vTokenAmountMantissa.toFixed());

      return {
        abi: collateralGatewayAbi,
        address: collateralGatewayAddress,
        functionName: 'supplyFromCollateral',
        args: [input.vToken.address, vTokenAmount, input.vhMarketVToken.address, 0n],
      } as WriteContractParameters<
        typeof collateralGatewayAbi,
        'supplyFromCollateral',
        readonly [Address, bigint, Address, bigint],
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
          value: input.underlyingAmountMantissa,
        }).toNumber(),
        fundingSource: 'collateral',
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
          FunctionKey.GET_V_TOKEN_BALANCE,
          {
            chainId,
            accountAddress,
            vTokenAddress: input.vhMarketVToken.address,
          },
        ],
      });
    },
    options,
  });
};
