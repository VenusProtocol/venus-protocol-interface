import type BigNumber from 'bignumber.js';

import type { OptionalTokenBalance } from 'containers/TokenListWrapper';
import type { Token } from 'types';
import { areTokensEqual } from 'utilities';

export const getSelectedTokenBalances = ({
  tokenBalances,
  fromToken,
  toToken,
}: {
  tokenBalances: OptionalTokenBalance[];
  fromToken: Token;
  toToken: Token;
}) =>
  tokenBalances.reduce(
    (acc, tokenBalance) => {
      if (areTokensEqual(tokenBalance.token, fromToken)) {
        acc.fromTokenUserBalanceMantissa = tokenBalance.balanceMantissa;
      } else if (areTokensEqual(tokenBalance.token, toToken)) {
        acc.toTokenUserBalanceMantissa = tokenBalance.balanceMantissa;
      }

      return acc;
    },
    {
      fromTokenUserBalanceMantissa: undefined,
      toTokenUserBalanceMantissa: undefined,
    } as {
      fromTokenUserBalanceMantissa?: BigNumber;
      toTokenUserBalanceMantissa?: BigNumber;
    },
  );
