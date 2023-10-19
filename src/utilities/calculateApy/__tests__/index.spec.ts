import BigNumber from 'bignumber.js';

import calculateApy from '..';

describe('calculateApy', () => {
  it('should calculate APY for given daily distributed tokens and decimals', () => {
    const dailyRate = new BigNumber('0.000012');

    expect(calculateApy({ dailyRate })).toMatchInlineSnapshot('"0.4389579824776835"');
  });
});
