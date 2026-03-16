import type BigNumber from 'bignumber.js';
import { useGetPool } from 'clients/api';

import type { Token, TokenAction, TokenBalance } from 'types';
import { areTokensEqual, convertTokensToMantissa } from 'utilities';
import type { Address } from 'viem';

export interface UseGetOperationFormTokenBalancesInput {
  poolComptrollerContractAddress: Address;
  underlyingToken: Token;
  isIntegratedSwapFeatureEnabled: boolean;
  canWrapNativeToken: boolean;
  action: TokenAction;
  accountAddress?: Address;
}

export interface UseGetOperationFormTokenBalancesOutput {
  tokenBalances: TokenBalance[];
  userWalletNativeTokenBalanceTokens?: BigNumber;
}

export const useGetOperationFormTokenBalances = ({
  poolComptrollerContractAddress,
  accountAddress,
  underlyingToken,
  isIntegratedSwapFeatureEnabled,
  action,
  canWrapNativeToken,
}: UseGetOperationFormTokenBalancesInput): UseGetOperationFormTokenBalancesOutput => {
  const { data: getPoolData } = useGetPool({
    poolComptrollerAddress: poolComptrollerContractAddress,
    accountAddress,
  });

  const assets = getPoolData?.pool.assets || [];

  const wrappedUnderlyingToken = underlyingToken.tokenWrapped;

  let userWalletNativeTokenBalanceTokens: BigNumber | undefined;
  const tokenBalances: TokenBalance[] = [];

  assets.forEach(asset => {
    const isWrappedToken = !!asset.vToken.underlyingToken.tokenWrapped;
    const isWrappedUnderlyingToken =
      wrappedUnderlyingToken &&
      areTokensEqual(asset.vToken.underlyingToken, wrappedUnderlyingToken);

    const shouldIncludeTokenBalance =
      isIntegratedSwapFeatureEnabled ||
      (canWrapNativeToken && (isWrappedToken || isWrappedUnderlyingToken)) ||
      areTokensEqual(underlyingToken, asset.vToken.underlyingToken);

    const isPaused = asset.disabledTokenActions.includes(action);

    if (shouldIncludeTokenBalance && !isPaused) {
      tokenBalances.push({
        token: asset.vToken.underlyingToken,
        balanceMantissa: convertTokensToMantissa({
          token: asset.vToken.underlyingToken,
          value: asset.userWalletBalanceTokens,
        }),
      });
    }

    if (asset.vToken.underlyingToken.isNative) {
      userWalletNativeTokenBalanceTokens = asset.userWalletBalanceTokens;
    }
  });

  return {
    tokenBalances,
    userWalletNativeTokenBalanceTokens,
  };
};
