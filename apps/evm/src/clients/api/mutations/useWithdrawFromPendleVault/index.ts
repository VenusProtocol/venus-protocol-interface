import type { Address } from 'viem';

import type { PendleContractWithdrawCallParams } from 'clients/api';
import { DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { pendlePtVaultAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { convertMantissaToTokens } from 'utilities/convertMantissaToTokens';
import { invalidatePendleVaultCaches } from 'utilities/invalidatePendleVaultCaches';
import { formatWithdrawParams } from './formatWithdrawParams';
import type { Options, PendlePtVaultWithdrawInput } from './types';

export const useWithdrawFromPendleVault = (
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
    fn: ({ swapQuote, fromToken, vToken }: PendlePtVaultWithdrawInput) => {
      if (!pendlePtVaultContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      if (vToken) {
        return {
          abi: pendlePtVaultAbi,
          address: pendlePtVaultContractAddress,
          functionName: 'withdraw' as const,
          args: formatWithdrawParams({
            params: swapQuote.contractCallParams as PendleContractWithdrawCallParams,
            fromToken,
            vToken,
          }) as never,
        } as const;
      }

      throw new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      });
    },
    onConfirmed: async ({ input }) => {
      captureAnalyticEvent('Pendle vault withdraw', {
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
