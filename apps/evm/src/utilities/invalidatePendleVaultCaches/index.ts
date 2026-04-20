import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import type { ChainId } from 'types';
import type { Address } from 'viem';
import type { TrimmedPendlePtVaultInput } from '../../clients/api/mutations/useStakeInPendleVault/types';

export const invalidatePendleVaultCaches = ({
  input,
  chainId,
  accountAddress,
  poolComptrollerAddress,
}: {
  input: TrimmedPendlePtVaultInput;
  chainId: ChainId;
  accountAddress?: string;
  poolComptrollerAddress?: Address;
}) => {
  queryClient.invalidateQueries({
    queryKey: [
      FunctionKey.GET_BALANCE_OF,
      {
        chainId,
        accountAddress,
        tokenAddress: input.fromToken.address,
      },
    ],
  });

  if (poolComptrollerAddress) {
    queryClient.invalidateQueries({
      queryKey: [
        FunctionKey.GET_TOKEN_ALLOWANCE,
        {
          chainId,
          tokenAddress: input.fromToken.address,
          accountAddress,
          spenderAddress: poolComptrollerAddress,
        },
      ],
    });
  }

  queryClient.invalidateQueries({
    queryKey: [
      FunctionKey.GET_BALANCE_OF,
      {
        chainId,
        accountAddress,
        tokenAddress: input.toToken.address,
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
  queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_FIXED_RATED_VAULTS] });
};
