import BigNumber from 'bignumber.js';

import calculateApy from '..';

describe('utilities/calculateApy', () => {
  it('should calculate APY for given daily distributed tokens and decimals', () => {
    const dailyRate = new BigNumber(1.05);

    expect(calculateApy({ dailyRate })).toMatchInlineSnapshot(
      '"3.008883857068843e+115"',
    );
  });
});
