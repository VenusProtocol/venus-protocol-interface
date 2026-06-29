import type { Address } from 'viem';

import { NULL_ADDRESS } from 'constants/address';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { pendlePtVaultAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { convertMantissaToTokens } from 'utilities/convertMantissaToTokens';
import { invalidatePendleVaultCaches } from 'utilities/invalidatePendleVaultCaches';
import type {
  PendlePtVaultWithdrawAtMaturityInput,
  WithdrawAtMaturityOptions,
} from '../useWithdrawFromPendleVault/types';

export const useWithdrawAtMaturityFromPendleVault = (
  {
    pendleMarketAddress,
    poolComptrollerAddress,
  }: {
    pendleMarketAddress: Address;
    poolComptrollerAddress?: Address;
  },
  options?: Partial<WithdrawAtMaturityOptions>,
) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();

  const { address: pendlePtVaultContractAddress } = useGetContractAddress({
    name: 'PendlePtVault',
  });

  return useSendTransaction({
    fn: ({ amountMantissa, toToken }: PendlePtVaultWithdrawAtMaturityInput) => {
      if (!pendlePtVaultContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      if (pendleMarketAddress === NULL_ADDRESS) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      return {
        abi: pendlePtVaultAbi,
        address: pendlePtVaultContractAddress,
        functionName: 'redeemAtMaturity' as const,
        args: [
          pendleMarketAddress,
          BigInt(amountMantissa.toFixed()),
          {
            tokenOut: toToken.isNative ? NULL_ADDRESS : toToken.address,
            minTokenOut: 0n,
            tokenRedeemSy: toToken.isNative ? NULL_ADDRESS : toToken.address,
            pendleSwap: NULL_ADDRESS,
            swapData: {
              swapType: 0,
              extRouter: NULL_ADDRESS,
              extCalldata: '0x',
              needScale: false,
            },
          },
        ],
      } as const;
    },
    onConfirmed: async ({ input }) => {
      const convertedAmountTokens = input.vToken
        ? convertMantissaToTokens({
            value: input.amountMantissa,
            token: input.vToken,
          }).toNumber()
        : 0;

      captureAnalyticEvent('Pendle vault redeemAtMaturity', {
        pendleMarketAddress,
        fromTokenSymbol: input.fromToken.symbol,
        fromTokenAmountTokens: convertedAmountTokens,
        toTokenSymbol: input.toToken.symbol,
        toTokenAmountTokens: convertedAmountTokens,
        priceImpactPercentage: 0,
        slippageTolerancePercentage: 0,
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
