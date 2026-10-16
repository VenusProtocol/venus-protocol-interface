import type BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import collateralGatewayAbi from 'libs/contracts/config/externalAbis/CollateralGateway.json';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';
import type { VToken } from 'types';
import { convertMantissaToTokens } from 'utilities';
import type { Account, Address, Chain, WriteContractParameters } from 'viem';

export type SupplyToSpokeInput = {
  vToken: VToken;
  poolName: string;
  amountMantissa: BigNumber;
};

type Options = UseSendTransactionOptions<SupplyToSpokeInput> & {
  onConfirmed?: () => unknown;
};

export const useSupplyToSpoke = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();
  const { address: collateralGatewayAddress } = useGetContractAddress({
    name: 'CollateralGateway',
  });

  const { onConfirmed, ...otherOptions } = options || {};

  return useSendTransaction({
    fn: (input: SupplyToSpokeInput) => {
      if (!accountAddress || !collateralGatewayAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      return {
        abi: collateralGatewayAbi,
        address: collateralGatewayAddress,
        functionName: 'supplyAndEnterSpokeMarkets',
        args: [[input.vToken.address], [BigInt(input.amountMantissa.toFixed())]],
      } as WriteContractParameters<
        typeof collateralGatewayAbi,
        'supplyAndEnterSpokeMarkets',
        readonly [readonly Address[], readonly bigint[]],
        Chain,
        Account
      >;
    },
    onConfirmed: ({ input }) => {
      captureAnalyticEvent('Tokens supplied', {
        poolName: input.poolName,
        tokenSymbol: input.vToken.underlyingToken.symbol,
        tokenAmountTokens: convertMantissaToTokens({
          token: input.vToken.underlyingToken,
          value: input.amountMantissa,
        }).toNumber(),
        fundingSource: 'wallet',
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
            tokenAddress: input.vToken.underlyingToken.address,
            accountAddress,
            spenderAddress: collateralGatewayAddress,
          },
        ],
      });

      onConfirmed?.();
    },
    options: otherOptions,
  });
};
