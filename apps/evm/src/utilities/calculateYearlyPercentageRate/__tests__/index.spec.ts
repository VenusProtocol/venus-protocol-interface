import BigNumber from 'bignumber.js';

import { MAX_VALUE, MIN_VALUE, calculateYearlyPercentageRate } from '..';

describe('calculateYearlyPercentageRate', () => {
  it('should calculate APY for given daily percentage rates and decimals', () => {
    const dailyPercentageRate = new BigNumber('0.000012');

    expect(calculateYearlyPercentageRate({ dailyPercentageRate })).toMatchInlineSnapshot(
      '"0.4389579824776835"',
    );
  });

  it('should calculate APR for given daily percentage rates and decimals', () => {
    const dailyPercentageRate = new BigNumber('0.000012');

    expect(
      calculateYearlyPercentageRate({ dailyPercentageRate, compound: false }),
    ).toMatchInlineSnapshot('"0.00438"');
  });

  it('should bound returned value to maximum', () => {
    expect(
      calculateYearlyPercentageRate({ dailyPercentageRate: Number.POSITIVE_INFINITY }),
    ).toEqual(new BigNumber(MAX_VALUE));
  });

  it('should bound returned value to minimum', () => {
    expect(
      calculateYearlyPercentageRate({ dailyPercentageRate: Number.NEGATIVE_INFINITY }),
    ).toEqual(new BigNumber(MIN_VALUE));
  });
});
