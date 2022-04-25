import BigNumber from 'bignumber.js';
import calculateDailyEarningsCents from './calculateDailyEarningsCents';

describe('utilities/calculateDailyEarningsCentss', () => {
  test('calculates daily Earnings for a single asset', () => {
    expect(calculateDailyEarningsCents(new BigNumber('1924.21991227022443813375')).toString()).toBe(
      '5.27183537608280667982',
    );
  });
});
