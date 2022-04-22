import BigNumber from 'bignumber.js';
import calculateDailyEarningsCents from './calculateDailyEarningsCents';

describe('utilities/calculateDailyEarningsCentss', () => {
  test('calculates yearly Earnings for array of assets', () => {
    expect(+calculateDailyEarningsCents(new BigNumber('1924.21991227022443813375'))).toBe(5);
  });
});
