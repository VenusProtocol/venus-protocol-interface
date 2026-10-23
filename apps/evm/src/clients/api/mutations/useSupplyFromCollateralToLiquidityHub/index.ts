import type BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import { COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import FunctionKey from 'constants/functionKey';
import { useChain } from 'hooks/useChain';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useGetUserSlippageTolerance } from 'hooks/useGetUserSlippageTolerance';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { collateralGatewayAbi, legacyPoolComptrollerAbi } from 'libs/contracts';
import liquidityHubAbi from 'libs/contracts/config/externalAbis/LiquidityHub.json';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId, usePublicClient } from 'libs/wallet';
import type { LiquidityHub, VToken } from 'types';
import { convertMantissaToTokens, subtractSlippageTolerance } from 'utilities';
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

const EXP_SCALE = BigInt(COMPOUND_MANTISSA);

const flashLoanFeeAbi = [
  {
    inputs: [],
    name: 'flashLoanFeeMantissa',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const useSupplyFromCollateralToLiquidityHub = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();
  const { publicClient } = usePublicClient();
  const { corePoolComptrollerContractAddress } = useChain();
  const { userSlippageTolerancePercentage } = useGetUserSlippageTolerance();
  const { address: collateralGatewayAddress } = useGetContractAddress({
    name: 'CollateralGateway',
  });

  return useSendTransaction({
    fn: async (input: SupplyFromCollateralToLiquidityHubInput) => {
      if (!accountAddress || !collateralGatewayAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      const vTokenAmount = input.migrateFullSupply
        ? maxUint256
        : BigInt(input.vTokenAmountMantissa.toFixed());

      const [treasuryPercent, flashLoanFee] = await Promise.all([
        publicClient.readContract({
          abi: legacyPoolComptrollerAbi,
          address: corePoolComptrollerContractAddress,
          functionName: 'treasuryPercent',
        }),
        publicClient.readContract({
          abi: flashLoanFeeAbi,
          address: input.vToken.address,
          functionName: 'flashLoanFeeMantissa',
        }),
      ]);

      // The flash-loan path deposits the redeem proceeds net of both fees
      const depositFloorMantissa =
        (((BigInt(input.underlyingAmountMantissa.toFixed()) * (EXP_SCALE - treasuryPercent)) /
          EXP_SCALE) *
          EXP_SCALE) /
        (EXP_SCALE + flashLoanFee);

      const previewShares = (await publicClient.readContract({
        abi: liquidityHubAbi,
        address: input.liquidityHub.vhToken.address,
        functionName: 'previewDeposit',
        args: [depositFloorMantissa],
      })) as bigint;

      const minShares = subtractSlippageTolerance({
        valueMantissa: previewShares,
        slippageTolerancePercentage: userSlippageTolerancePercentage,
      });

      return {
        abi: collateralGatewayAbi,
        address: collateralGatewayAddress,
        functionName: 'supplyFromCollateral',
        args: [input.vToken.address, vTokenAmount, input.vhMarketVToken.address, minShares],
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
