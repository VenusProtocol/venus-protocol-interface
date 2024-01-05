import BigNumber from 'bignumber.js';

import { Asset, Token } from 'types';
import { convertMantissaToTokens } from 'utilities';

interface GetInitialValuesInput {
  assetData: Asset;
  userXvsStakedMantissa: BigNumber | undefined;
  primeMinimumStakedXvsMantissa: BigNumber;
  xvs: Token;
}

const ZERO_TOKENS = new BigNumber(0);

export const getInitialValues = ({
  assetData,
  userXvsStakedMantissa,
  primeMinimumStakedXvsMantissa,
  xvs,
}: GetInitialValuesInput) => {
  let initialStakedAmountXvsTokens = new BigNumber(0);
  let initialBorrowAmountTokens = new BigNumber(0);
  let initialSupplyAmountTokens = new BigNumber(0);

  if (userXvsStakedMantissa) {
    const gteMinimumXvsStaked = userXvsStakedMantissa.isGreaterThanOrEqualTo(
      primeMinimumStakedXvsMantissa,
    );
    if (gteMinimumXvsStaked) {
      const userStakedXvsTokens = convertMantissaToTokens({
        value: userXvsStakedMantissa,
        token: xvs,
      });
      initialStakedAmountXvsTokens = userStakedXvsTokens;
    }
  }

  if (
    assetData.userBorrowBalanceTokens.isGreaterThan(ZERO_TOKENS) ||
    assetData.userSupplyBalanceTokens.isGreaterThan(ZERO_TOKENS)
  ) {
    initialBorrowAmountTokens = assetData.userBorrowBalanceTokens;
    initialSupplyAmountTokens = assetData.userSupplyBalanceTokens;
  }

  return {
    initialStakedAmountXvsTokens,
    initialBorrowAmountTokens,
    initialSupplyAmountTokens,
  };
};
