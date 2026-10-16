import type BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import spokeVTokenAbi from 'libs/contracts/config/externalAbis/SpokeVToken.json';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';
import type { VToken } from 'types';
import { convertMantissaToTokens } from 'utilities';
import type { Account, Chain, WriteContractParameters } from 'viem';

export type BorrowFromSpokeInput = {
  vToken: VToken;
  poolName: string;
  amountMantissa: BigNumber;
};

type Options = UseSendTransactionOptions<BorrowFromSpokeInput>;

export const useBorrowFromSpoke = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fn: (input: BorrowFromSpokeInput) => {
      if (!accountAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      return {
        abi: spokeVTokenAbi,
        address: input.vToken.address,
        functionName: 'borrow',
        args: [BigInt(input.amountMantissa.toFixed())],
      } as WriteContractParameters<
        typeof spokeVTokenAbi,
        'borrow',
        readonly [bigint],
        Chain,
        Account
      >;
    },
    onConfirmed: ({ input }) => {
      captureAnalyticEvent('Tokens borrowed', {
        poolName: input.poolName,
        tokenSymbol: input.vToken.underlyingToken.symbol,
        tokenAmountTokens: convertMantissaToTokens({
          token: input.vToken.underlyingToken,
          value: input.amountMantissa,
        }).toNumber(),
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
    },
    options,
  });
};
