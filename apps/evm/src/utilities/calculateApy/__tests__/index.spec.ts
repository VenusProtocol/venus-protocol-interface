import BigNumber from 'bignumber.js';

import calculateApy, { MAX_VALUE, MIN_VALUE } from '..';

describe('calculateApy', () => {
  it('should calculate APY for given daily distributed tokens and decimals', () => {
    const dailyRate = new BigNumber('0.000012');

    expect(calculateApy({ dailyRate })).toMatchInlineSnapshot('"0.4389579824776835"');
  });

  it('should bound returned value to maximum', () => {
    expect(calculateApy({ dailyRate: Number.POSITIVE_INFINITY })).toEqual(new BigNumber(MAX_VALUE));
  });

  it('should bound returned value to minimum', () => {
    expect(calculateApy({ dailyRate: Number.NEGATIVE_INFINITY })).toEqual(new BigNumber(MIN_VALUE));
  });
});
