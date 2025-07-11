import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import MAX_UINT256 from 'constants/maxUint256';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import {
  getContractAddress,
  maximillionAbi,
  nativeTokenGatewayAbi,
  vBep20Abi,
  vBnbAbi,
} from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';
import type { VToken } from 'types';
import { buffer, convertMantissaToTokens } from 'utilities';
import type { Account, Address, Chain, WriteContractParameters } from 'viem';

type BaseInput = {
  poolName: string;
  vToken: VToken;
  amountMantissa: BigNumber;
  repayFullLoan?: boolean;
  wrap?: boolean;
};

type WrapAndRepayInput = BaseInput & {
  wrap: true;
  poolComptrollerContractAddress: Address;
};

type RepayTokensInput = BaseInput & {
  wrap?: false;
};

type RepayInput = WrapAndRepayInput | RepayTokensInput;

type Options = UseSendTransactionOptions<RepayInput>;

export const useRepay = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();

  const { address: maximillionContractAddress } = useGetContractAddress({
    name: 'Maximillion',
  });

  return useSendTransaction({
    // @ts-ignore mixing payable and non-payable function calls messes up with the typing of
    // useSendTransaction
    fn: (input: RepayInput) => {
      if (!accountAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      // Handle repaying full BNB loan.  Note that we only check for the isNative prop; that's
      // because at the moment BNB is the only native market we have
      if (
        input.vToken.underlyingToken.isNative &&
        input.repayFullLoan &&
        !maximillionContractAddress
      ) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      if (input.vToken.underlyingToken.isNative && input.repayFullLoan) {
        return {
          address: maximillionContractAddress,
          abi: maximillionAbi,
          functionName: 'repayBehalfExplicit',
          args: [accountAddress, input.vToken.address],
          value:
            // Buffer amount to account for accrued interests while transaction is processing
            buffer({
              amountMantissa: BigInt(input.amountMantissa.toFixed()),
            }),
        } as WriteContractParameters<
          typeof maximillionAbi,
          'repayBehalfExplicit',
          readonly [Address, Address],
          Chain,
          Account
        >;
      }

      // Handle repaying partial BNB loan
      if (input.vToken.underlyingToken.isNative) {
        return {
          address: input.vToken.address,
          abi: vBnbAbi,
          functionName: 'repayBorrow',
          value: BigInt(input.amountMantissa.toFixed()),
        } as WriteContractParameters<typeof vBnbAbi, 'repayBorrow', readonly [], Chain, Account>;
      }

      // Handle repaying native loan by first wrapping tokens
      const nativeTokenGatewayContractAddress = input.wrap
        ? getContractAddress({
            name: 'NativeTokenGateway',
            poolComptrollerContractAddress: input.poolComptrollerContractAddress,
            chainId,
          })
        : undefined;

      if (
        input.wrap &&
        (!nativeTokenGatewayContractAddress || !input.vToken.underlyingToken.tokenWrapped)
      ) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      if (input.wrap && nativeTokenGatewayContractAddress) {
        return {
          abi: nativeTokenGatewayAbi,
          address: nativeTokenGatewayContractAddress,
          functionName: 'wrapAndRepay',
          value: input.repayFullLoan
            ? // Buffer amount to account for accrued interests while transaction is processing
              buffer({ amountMantissa: BigInt(input.amountMantissa.toFixed()) })
            : BigInt(input.amountMantissa.toFixed()),
        } as WriteContractParameters<
          typeof nativeTokenGatewayAbi,
          'wrapAndRepay',
          readonly [],
          Chain,
          Account
        >;
      }

      return {
        abi: vBep20Abi,
        address: input.vToken.address,
        functionName: 'repayBorrow',
        args: [
          input.repayFullLoan
            ? BigInt(MAX_UINT256.toFixed())
            : BigInt(input.amountMantissa.toFixed()),
        ],
      } as WriteContractParameters<
        typeof vBep20Abi,
        'repayBorrow',
        readonly [bigint],
        Chain,
        Account
      >;
    },
    onConfirmed: async ({ input }) => {
      captureAnalyticEvent('Tokens repaid', {
        poolName: input.poolName,
        tokenSymbol: input.vToken.underlyingToken.symbol,
        tokenAmountTokens: convertMantissaToTokens({
          token: input.vToken.underlyingToken,
          value: input.amountMantissa,
        }).toNumber(),
        repaidFullLoan: input.repayFullLoan || false,
      });

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_POOLS],
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

      if (input.wrap && input.vToken.underlyingToken.tokenWrapped) {
        queryClient.invalidateQueries({
          queryKey: [
            FunctionKey.GET_BALANCE_OF,
            {
              chainId,
              accountAddress,
              tokenAddress: input.vToken.underlyingToken.tokenWrapped.address,
            },
          ],
        });
      }
    },
    options,
  });
};
