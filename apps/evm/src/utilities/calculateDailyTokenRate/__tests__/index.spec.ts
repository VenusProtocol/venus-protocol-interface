import BigNumber from 'bignumber.js';

import { calculateDailyTokenRate } from '..';

const rateMantissa = new BigNumber(100);
const decimals = 2;

describe('calculateDailyTokenRate', () => {
  it('should correctly calculate daily, block based token rate', () => {
    expect(
      calculateDailyTokenRate({ rateMantissa, decimals, blocksPerDay: 28800 }),
    ).toMatchInlineSnapshot('"28800"');
  });

  it('should correctly calculate daily, time based token rate', () => {
    expect(calculateDailyTokenRate({ rateMantissa, decimals })).toMatchInlineSnapshot('"86400"');
  });
});
