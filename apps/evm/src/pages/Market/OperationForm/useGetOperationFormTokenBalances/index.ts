import type BigNumber from 'bignumber.js';

import { useGetSwapTokenUserBalances } from 'hooks/useGetSwapTokenUserBalances';
import type { Token, TokenBalance } from 'types';
import { areTokensEqual, convertMantissaToTokens } from 'utilities';
import type { Address } from 'viem';

export interface UseGetOperationFormTokenBalancesInput {
  poolComptrollerContractAddress: Address;
  accountAddress?: Address;
  underlyingToken: Token;
  isIntegratedSwapFeatureEnabled: boolean;
  canWrapNativeToken: boolean;
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
  canWrapNativeToken,
}: UseGetOperationFormTokenBalancesInput): UseGetOperationFormTokenBalancesOutput => {
  const { data: getSwapTokenUserBalancesData } = useGetSwapTokenUserBalances({
    poolComptrollerContractAddress,
    accountAddress,
  });

  const userPoolTokenBalancesData = getSwapTokenUserBalancesData || [];
  const wrappedUnderlyingToken = underlyingToken.tokenWrapped;

  let userWalletNativeTokenBalanceTokens: BigNumber | undefined;
  const tokenBalances: TokenBalance[] = [];

  userPoolTokenBalancesData.forEach(tokenBalance => {
    const isWrappedToken = !!tokenBalance.token.tokenWrapped;
    const isWrappedUnderlyingToken =
      wrappedUnderlyingToken && areTokensEqual(tokenBalance.token, wrappedUnderlyingToken);

    const shouldIncludeTokenBalance =
      isIntegratedSwapFeatureEnabled ||
      (canWrapNativeToken && (isWrappedToken || isWrappedUnderlyingToken));

    if (shouldIncludeTokenBalance) {
      tokenBalances.push(tokenBalance);
    }

    if (tokenBalance.token.isNative) {
      userWalletNativeTokenBalanceTokens = convertMantissaToTokens({
        value: tokenBalance.balanceMantissa,
        token: tokenBalance.token,
      });
    }
  });

  return {
    tokenBalances,
    userWalletNativeTokenBalanceTokens,
  };
};
