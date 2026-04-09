import type { PendleContractDepositCallParams } from 'clients/api';
import { DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { pendlePtVaultAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { invalidatePendleVaultCaches } from 'utilities';
import { convertMantissaToTokens } from 'utilities/convertMantissaToTokens';
import type { Address } from 'viem';
import { formatDepositParams } from './formatDepositParams';
import type { Options, TrimmedPendlePtVaultInput } from './types';

export const useStakeInPendleVault = (
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
    // @ts-expect-error mixing payable and non-payable function calls messes up with the typing of
    // useSendTransaction
    fn: ({ swapQuote, type, amountMantissa }: TrimmedPendlePtVaultInput) => {
      if (!pendlePtVaultContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      if (type === 'deposit' && !isNative) {
        return {
          abi: pendlePtVaultAbi,
          address: pendlePtVaultContractAddress,
          functionName: 'deposit' as const,
          args: formatDepositParams(
            swapQuote.contractCallParams as PendleContractDepositCallParams,
          ),
        } as const;
      }

      if (type === 'deposit' && isNative) {
        return {
          abi: pendlePtVaultAbi,
          address: pendlePtVaultContractAddress,
          functionName: 'depositNative' as const,
          args: formatDepositParams(
            swapQuote.contractCallParams as PendleContractDepositCallParams,
          ),
          value: BigInt(amountMantissa.toFixed()),
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
