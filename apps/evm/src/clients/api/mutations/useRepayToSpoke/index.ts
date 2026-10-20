import type BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import MAX_UINT256 from 'constants/maxUint256';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { spokeVTokenAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';
import type { VToken } from 'types';
import { convertMantissaToTokens } from 'utilities';

export type RepayToSpokeInput = {
  vToken: VToken;
  poolName: string;
  amountMantissa: BigNumber;
  repayFullLoan: boolean;
};

type Options = UseSendTransactionOptions<RepayToSpokeInput>;

export const useRepayToSpoke = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fn: (input: RepayToSpokeInput) => {
      if (!accountAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      return {
        abi: spokeVTokenAbi,
        address: input.vToken.address,
        functionName: 'repayBorrow',
        args: [BigInt((input.repayFullLoan ? MAX_UINT256 : input.amountMantissa).toFixed())],
      };
    },
    onConfirmed: ({ input }) => {
      captureAnalyticEvent('Tokens repaid', {
        poolName: input.poolName,
        tokenSymbol: input.vToken.underlyingToken.symbol,
        tokenAmountTokens: convertMantissaToTokens({
          token: input.vToken.underlyingToken,
          value: input.amountMantissa,
        }).toNumber(),
        repaidFullLoan: input.repayFullLoan,
      });

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_SPOKE_POOLS],
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
            tokenAddress: input.vToken.underlyingToken.address,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            chainId,
            tokenAddress: input.vToken.underlyingToken.address,
            accountAddress,
            spenderAddress: input.vToken.address,
          },
        ],
      });
    },
    options,
  });
};
