import BigNumber from 'bignumber.js';

import calculateDailyDistributedTokens from '..';

describe('utilities/calculateDailyDistributedTokens', () => {
  it('should calculate daily distributed tokens for given rate per block and decimals', () => {
    const mantissa = new BigNumber(100);
    const decimals = 2;

    expect(calculateDailyDistributedTokens({ mantissa, decimals })).toMatchInlineSnapshot(
      '"28800"',
    );
  });
});
