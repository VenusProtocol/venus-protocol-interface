import BigNumber from 'bignumber.js';

import { calculateDailyInterests } from '..';

describe('calculateDailyInterests', () => {
  test('calculates daily Earnings for a single asset', () => {
    expect(calculateDailyInterests(new BigNumber('1924.21991227022443813375')).toString()).toBe(
      '5.27183537608280667981',
    );
  });
});
