import React from 'react';
import { PSTokenCombination } from 'types';

import { PANCAKE_SWAP_TOKENS } from 'constants/tokens';
import renderComponent from 'testUtils/renderComponent';

import useGetTokenCombinations from '../useGetTokenCombinations';

describe('pages/Swap/useGetSwapInfo/useGetTokenCombinations', () => {
  it('returns all possible combinations between the tokens provided and the base trade ones', () => {
    let tokenCombinations: PSTokenCombination[] = [];

    const TestComponent = () => {
      tokenCombinations = useGetTokenCombinations({
        fromToken: PANCAKE_SWAP_TOKENS.busd,
        toToken: PANCAKE_SWAP_TOKENS.cake,
      });

      return <></>;
    };

    renderComponent(TestComponent);

    // Test there's no duplicates
    let hasDuplicate = false;

    tokenCombinations.reduce((acc, tokenCombination) => {
      hasDuplicate = acc.some(
        prevTokenCombination =>
          prevTokenCombination[0].address.toLowerCase() ===
            tokenCombination[0].address.toLowerCase() &&
          prevTokenCombination[1].address.toLowerCase() ===
            tokenCombination[1].address.toLowerCase(),
      );

      return [...acc, tokenCombination];
    }, [] as PSTokenCombination[]);

    expect(hasDuplicate).toBe(false);

    expect(tokenCombinations).toMatchSnapshot();
  });

  it('uses wBNB when BNB is provided', () => {
    let tokenCombinations: PSTokenCombination[] = [];

    const TestComponent = () => {
      tokenCombinations = useGetTokenCombinations({
        fromToken: PANCAKE_SWAP_TOKENS.bnb,
        toToken: PANCAKE_SWAP_TOKENS.cake,
      });

      return <></>;
    };

    renderComponent(TestComponent);

    expect(tokenCombinations).toMatchSnapshot();
  });
});
