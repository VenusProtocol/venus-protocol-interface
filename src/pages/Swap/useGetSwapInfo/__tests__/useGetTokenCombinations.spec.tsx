import { Token as PSToken } from '@pancakeswap/sdk/dist/index.js';
import React from 'react';

import { PANCAKE_SWAP_TOKENS } from 'constants/tokens';
import renderComponent from 'testUtils/renderComponent';

import useGetTokenCombinations from '../useGetTokenCombinations';

describe('pages/Swap/useGetSwapInfo/useGetTokenCombinations', () => {
  it('returns all possible combinations between the tokens provided and the base trade ones', () => {
    let tokenCombinations: [PSToken, PSToken][] = [];

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
          prevTokenCombination[0].address === tokenCombination[0].address &&
          prevTokenCombination[1].address === tokenCombination[1].address,
      );

      return [...acc, tokenCombination];
    }, [] as [PSToken, PSToken][]);

    expect(hasDuplicate).toBe(false);

    expect(tokenCombinations).toMatchSnapshot();
  });

  it('uses wBNB when BNB is provided', () => {
    let tokenCombinations: [PSToken, PSToken][] = [];

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
