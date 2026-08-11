import type BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { liquidityHubMigratorAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';
import type { VToken, VhToken } from 'types';
import { convertMantissaToTokens, convertTokensToMantissa } from 'utilities';
import type { Account, Address, Chain, WriteContractParameters } from 'viem';

export type MigrateCoreSupplyToLiquidityHubInput = {
  vhToken: VhToken;
  vToken: VToken;
  exchangeRateVTokens: BigNumber;
  amountMantissa: BigNumber;
  liquidityHubMigratorContractAddress?: Address;
  minSharesMantissa?: BigNumber;
};

type Options = UseSendTransactionOptions<MigrateCoreSupplyToLiquidityHubInput>;

export const useMigrateCoreSupplyToLiquidityHub = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    // @ts-ignore mixing function calls messes up with the typing of useSendTransaction
    fn: (input: MigrateCoreSupplyToLiquidityHubInput) => {
      if (!accountAddress || !input.liquidityHubMigratorContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      const amountTokens = convertMantissaToTokens({
        token: input.vToken.underlyingToken,
        value: input.amountMantissa,
      });
      const vTokenAmountTokens = amountTokens.times(input.exchangeRateVTokens);
      const vTokenAmountMantissa = convertTokensToMantissa({
        token: input.vToken,
        value: vTokenAmountTokens,
      });
      const minSharesMantissa = input.minSharesMantissa;
      const minShares = minSharesMantissa ? BigInt(minSharesMantissa.toFixed()) : 0n;

      if (input.vToken.underlyingToken.isNative) {
        return {
          abi: liquidityHubMigratorAbi,
          address: input.liquidityHubMigratorContractAddress,
          functionName: 'migrateFromCoreBNB',
          args: [
            BigInt(vTokenAmountMantissa.toFixed()),
            input.vhToken.address,
            accountAddress,
            minShares,
          ],
        } as WriteContractParameters<
          typeof liquidityHubMigratorAbi,
          'migrateFromCoreBNB',
          readonly [bigint, Address, Address, bigint],
          Chain,
          Account
        >;
      }

      return {
        abi: liquidityHubMigratorAbi,
        address: input.liquidityHubMigratorContractAddress,
        functionName: 'migrateFromCore',
        args: [
          input.vToken.address,
          BigInt(vTokenAmountMantissa.toFixed()),
          input.vhToken.address,
          accountAddress,
          minShares,
        ],
      } as WriteContractParameters<
        typeof liquidityHubMigratorAbi,
        'migrateFromCore',
        readonly [Address, bigint, Address, Address, bigint],
        Chain,
        Account
      >;
    },
    onConfirmed: ({ input }) => {
      captureAnalyticEvent('Tokens supplied', {
        poolName: 'liquidity_hub',
        tokenSymbol: input.vhToken.underlyingToken.symbol,
        tokenAmountTokens: convertMantissaToTokens({
          token: input.vhToken.underlyingToken,
          value: input.amountMantissa,
        }).toNumber(),
        fundingSource: 'core_pool_collateral',
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_LIQUIDITY_HUB,
          {
            vhTokenAddress: input.vhToken.address,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_LIQUIDITY_HUBS],
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
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            chainId,
            tokenAddress: input.vToken.address,
            accountAddress,
            spenderAddress: input.liquidityHubMigratorContractAddress,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress,
            tokenAddress: input.vhToken.address,
          },
        ],
      });
    },
    options,
  });
};
