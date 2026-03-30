import type { PendleContractWithdrawCallParams } from 'clients/api';
import { DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { pendlePtVaultAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { convertMantissaToTokens } from 'utilities/convertMantissaToTokens';
import type { Address } from 'viem';
import type { Options, TrimmedPendlePtVaultInput } from '../types';
import { invalidatePendleVaultCaches } from '../utils/invalidatePendleVaultCaches';
import { formatWithdrawParams } from './formatWithdrawParams';

export const usePendlePtVaultWithdraw = (
  {
    pendleMarketAddress,
    poolComptrollerAddress,
  }: {
    pendleMarketAddress: Address;
    poolComptrollerAddress?: Address;
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
    fn: ({ swapQuote, type, fromToken, vToken }: TrimmedPendlePtVaultInput) => {
      if (!pendlePtVaultContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }
      // Withdraw
      if (type === 'withdraw' && vToken) {
        return {
          abi: pendlePtVaultAbi,
          address: pendlePtVaultContractAddress,
          functionName: 'withdraw' as const,
          args: formatWithdrawParams(
            swapQuote.contractCallParams as PendleContractWithdrawCallParams,
            {
              fromToken,
              vToken,
            },
          ),
        } as const;
      }

      // Redeem after maturity
      if (type === 'redeemAtMaturity' && vToken) {
        return {
          abi: pendlePtVaultAbi,
          address: pendlePtVaultContractAddress,
          functionName: 'redeemAtMaturity' as const,
          args: formatWithdrawParams(
            swapQuote.contractCallParams as PendleContractWithdrawCallParams,
            { fromToken, vToken },
          ), // Share the same format as withdraw.
        } as const;
      }

      throw new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      });
    },
    onConfirmed: async ({ input }) => {
      captureAnalyticEvent(`Pendle vault ${input.type}`, {
        pendleMarketAddress,
        fromTokenSymbol: input.fromToken.symbol,
        fromTokenAmountTokens: convertMantissaToTokens({
          value: input.amountMantissa,
          token: input.fromToken,
        }).toNumber(),
        toTokenSymbol: input.toToken.symbol,
        toTokenAmountTokens: convertMantissaToTokens({
          token: input.toToken,
          value: input.swapQuote.estimatedReceivedTokensMantissa,
        }).toNumber(),
        priceImpactPercentage: input.swapQuote.priceImpactPercentage,
        slippageTolerancePercentage: DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE,
      });

      invalidatePendleVaultCaches({
        input,
        chainId,
        accountAddress,
        poolComptrollerAddress,
      });
    },
    options,
  });
};
