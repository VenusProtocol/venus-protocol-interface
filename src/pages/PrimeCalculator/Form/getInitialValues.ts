import BigNumber from 'bignumber.js';

import {
  borrowAveragesForToken,
  supplyAveragesForToken,
  xvsStakedAveragesForToken,
} from 'constants/prime';
import { Asset, Token } from 'types';
import { convertTokensToMantissa } from 'utilities';

interface GetInitialValuesInput {
  assetData: Asset;
  userXvsStakedMantissa: BigNumber | undefined;
  primeMinimumStakedXvsMantissa: BigNumber;
  xvs: Token;
}

export const getInitialValues = ({
  assetData,
  userXvsStakedMantissa,
  primeMinimumStakedXvsMantissa,
  xvs,
}: GetInitialValuesInput) => {
  const underlyingSymbol = assetData.vToken.underlyingToken.symbol;
  let initialStakedAmountXvsTokens = xvsStakedAveragesForToken[underlyingSymbol];
  const initialBorrowAmountTokens = borrowAveragesForToken[underlyingSymbol];
  const initialSupplyAmountTokens = supplyAveragesForToken[underlyingSymbol];

  if (userXvsStakedMantissa) {
    const moreThanMinimumXvsStaked = userXvsStakedMantissa.isGreaterThan(
      primeMinimumStakedXvsMantissa,
    );
    if (moreThanMinimumXvsStaked) {
      const userStakedXvsTokens = convertTokensToMantissa({
        value: userXvsStakedMantissa,
        token: xvs,
      });
      initialStakedAmountXvsTokens = userStakedXvsTokens;
    }
  }

  return {
    initialStakedAmountXvsTokens,
    initialBorrowAmountTokens,
    initialSupplyAmountTokens,
  };
};
