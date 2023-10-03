import { ChainId } from 'types';
import { areAddressesEqual } from 'utilities';

import { getPancakeSwapTokens } from 'packages/tokens/utilities/getPancakeSwapTokens';
import { getTokens } from 'packages/tokens/utilities/getTokens';

export interface GetSwapTokensInput {
  chainId: ChainId;
}

export const getSwapTokens = ({ chainId }: GetSwapTokensInput) => {
  const venusTokens = getTokens({
    chainId,
  });

  const psTokens = getPancakeSwapTokens({
    chainId,
  });

  return (
    psTokens
      // We filter out the tokens listed on Venus from the list of Pancake Swap tokens before adding
      // the full list back. The reason we do this is to make sure all the tokens listed on Venus
      // are added, while preventing duplicates.
      .filter(
        psToken =>
          // Filter out tokens listed on Venus
          !venusTokens.some(venusToken => areAddressesEqual(psToken.address, venusToken.address)),
      )
      // Add tokens listed on Venus
      .concat(venusTokens)
  );
};
