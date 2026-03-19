import type BigNumber from 'bignumber.js';
import { type GetPendleSwapQuoteOutput, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { pendlePtVaultAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';
import type { Token } from 'types';
import { convertMantissaToTokens } from 'utilities/convertMantissaToTokens';
import type { Address } from 'viem';
import { formatDepositOutput } from './utils';

export interface PendlePtVaultInput {
  pendlePtVaultContractAddress: Address;
  swapQuote: GetPendleSwapQuoteOutput;
  type: 'deposit' | 'withdraw' | 'redeemAtMaturity';
  stakedToken: Token;
  rewardToken: Token;
  amountToken: BigNumber;
}

type TrimmedPendlePtVaultInput = Omit<PendlePtVaultInput, 'pendlePtVaultContractAddress'>;
type Options = UseSendTransactionOptions<TrimmedPendlePtVaultInput>;

export const usePendlePtVault = (
  {
    pendleMarketAddress,
    poolComptrollerAddress,
    isNative,
  }: {
    pendleMarketAddress: Address;
    poolComptrollerAddress?: Address;
    isNative?: boolean;
  },
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();

  const { address: pendlePtVaultContractAddress } = useGetContractAddress({
    name: 'PendlePtVault',
  });

  return useSendTransaction({
    // @ts-ignore mixing payable and non-payable function calls messes up with the typing of
    // useSendTransaction
    fn: ({ swapQuote, type, amountToken }: TrimmedPendlePtVaultInput) => {
      if (!pendlePtVaultContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }
      // Deposit non-BNB tokens
      if (type === 'deposit' && !isNative) {
        console.log('deposit', isNative, formatDepositOutput(swapQuote.contractCallParams));
        return {
          abi: pendlePtVaultAbi,
          address: pendlePtVaultContractAddress,
          functionName: 'deposit' as const,
          args: formatDepositOutput(swapQuote.contractCallParams),
        } as const;
      }

      // Deposit BNB tokens
      if (type === 'deposit' && isNative) {
        return {
          abi: pendlePtVaultAbi,
          address: pendlePtVaultContractAddress,
          functionName: 'depositNative' as const,
          args: swapQuote.contractCallParams,
          value: BigInt(amountToken.toFixed()),
        } as const;
      }

      // Withdraw
      if (type === 'withdraw') {
        return {
          abi: pendlePtVaultAbi,
          address: pendlePtVaultContractAddress,
          functionName: 'withdraw' as const,
          args: swapQuote.contractCallParams,
        } as const;
      }

      if (type === 'redeemAtMaturity') {
        return {
          abi: pendlePtVaultAbi,
          address: pendlePtVaultContractAddress,
          functionName: 'redeemAtMaturity' as const,
          args: swapQuote.contractCallParams,
        } as const;
      }

      throw new VError({
        type: 'unexpected',
        code: 'incorrectSwapInput',
      });
    },
    onConfirmed: async ({ input }) => {
      captureAnalyticEvent(`Pendle vault ${input.type}`, {
        pendleMarketAddress: pendleMarketAddress,
        fromTokenSymbol: input.stakedToken.symbol,
        fromTokenAmountTokens: (
          convertMantissaToTokens({
            token: input.stakedToken,
            value: input.amountToken,
          }) ?? '0'
        ).toNumber(),
        toTokenSymbol: input.rewardToken.symbol,
        toTokenAmountTokens: (
          convertMantissaToTokens({
            token: input.rewardToken,
            value: input.swapQuote.estReceiveMantissa,
          }) ?? '0'
        ).toNumber(),
        priceImpactPercentage: input.swapQuote.priceImpactPercentage,
        slippageTolerancePercentage: DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE,
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress,
            tokenAddress: input.stakedToken.address,
          },
        ],
      });

      poolComptrollerAddress &&
        queryClient.invalidateQueries({
          queryKey: [
            FunctionKey.GET_TOKEN_ALLOWANCE,
            {
              chainId,
              tokenAddress: input.stakedToken.address,
              accountAddress,
              spenderAddress: poolComptrollerAddress,
            },
          ],
        });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress,
            tokenAddress: input.rewardToken.address,
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

      queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_V_TOKEN_BALANCES_ALL] });
      queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_POOLS] });
    },
    options,
  });
};
