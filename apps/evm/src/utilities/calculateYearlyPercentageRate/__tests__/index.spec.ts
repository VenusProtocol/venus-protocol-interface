import BigNumber from 'bignumber.js';

import { calculateDailyTokenRate } from 'utilities/calculateDailyTokenRate';

import { MAX_VALUE, MIN_VALUE, calculateYearlyPercentageRate } from '..';

describe('calculateYearlyPercentageRate', () => {
  it('should calculate APY for given daily percentage rate and decimals', () => {
    const dailyPercentageRate = new BigNumber('0.000012');

    expect(calculateYearlyPercentageRate({ dailyPercentageRate })).toMatchInlineSnapshot(
      '"0.439"',
    );
  });

  it('should round APY to 6 decimals of its decimal value, half up', () => {
    expect(
      calculateYearlyPercentageRate({ dailyPercentageRate: '0.00016392' }).toFixed(),
    ).toBe('6.1652');
  });

  it('should return 6% for a 6% rate model despite integer division loss', () => {
    const dailyPercentageRate = calculateDailyTokenRate({
      rateMantissa: '831529101',
      blocksPerDay: 192000,
    });

    expect(calculateYearlyPercentageRate({ dailyPercentageRate }).toFixed()).toBe('6');
  });

  it('should calculate APR for given daily percentage rate and decimals', () => {
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
