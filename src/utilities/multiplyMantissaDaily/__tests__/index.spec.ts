import BigNumber from 'bignumber.js';

import multiplyMantissaDaily from '..';

describe('utilities/multiplyMantissaDaily', () => {
  it('should calculate daily distributed tokens for given rate per block and decimals', () => {
    const mantissa = new BigNumber(100);
    const decimals = 2;

    expect(multiplyMantissaDaily({ mantissa, decimals })).toMatchInlineSnapshot('"28800"');
  });
});
