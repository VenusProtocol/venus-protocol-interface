import React from 'react';

import { bnb, busd, xvs } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import { PSTokenCombination } from 'types';

import useGetTokenCombinations from '../useGetTokenCombinations';

describe('pages/Swap/useGetSwapInfo/useGetTokenCombinations', () => {
  it('returns all possible combinations between the tokens provided and the base trade ones', () => {
    let tokenCombinations: PSTokenCombination[] = [];

    const TestComponent = () => {
      tokenCombinations = useGetTokenCombinations({
        fromToken: busd,
        toToken: xvs,
      });

      return <></>;
    };

    renderComponent(<TestComponent />);

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
        fromToken: bnb,
        toToken: xvs,
      });

      return <></>;
    };

    renderComponent(<TestComponent />);

    expect(tokenCombinations).toMatchSnapshot();
  });
});
