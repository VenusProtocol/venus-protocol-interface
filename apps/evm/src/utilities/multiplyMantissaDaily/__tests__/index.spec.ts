import BigNumber from 'bignumber.js';

import multiplyMantissaDaily from '..';

describe('multiplyMantissaDaily', () => {
  it('should calculate daily distributed tokens for given rate per block and decimals', () => {
    const mantissa = new BigNumber(100);
    const decimals = 2;

    expect(
      multiplyMantissaDaily({ mantissa, decimals, blocksPerDay: 28800 }),
    ).toMatchInlineSnapshot('"28800"');
  });
});
