import type BigNumber from 'bignumber.js';
import { useGetPool } from 'clients/api';
import type { OptionalTokenBalance } from 'containers/TokenListWrapper';

import type { Token, TokenAction } from 'types';
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
  tokenBalances: OptionalTokenBalance[];
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
  const tokenBalances: OptionalTokenBalance[] = [];

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

    const isRestricted =
      asset.isRestricted && !areTokensEqual(asset.vToken.underlyingToken, underlyingToken);

    if (shouldIncludeTokenBalance && !isPaused && !isRestricted) {
      tokenBalances.push({
        token: asset.vToken.underlyingToken,
        balanceMantissa: convertTokensToMantissa({
          token: asset.vToken.underlyingToken,
          value: asset.userWalletBalanceTokens,
        }),
        isGated: asset.isGated,
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
