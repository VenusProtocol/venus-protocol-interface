import BigNumber from 'bignumber.js';

import calculateDailyDistributedTokens from '..';

describe('utilities/calculateDailyDistributedTokens', () => {
  it('should calculate daily distributed tokens for given rate per block and decimals', () => {
    const ratePerBlockMantissa = new BigNumber(100);

    expect(calculateDailyDistributedTokens({ ratePerBlockMantissa })).toMatchInlineSnapshot(
      '"2.88e-12"',
    );
  });
});
