import BigNumber from 'bignumber.js';

import { TESTNET_TOKENS } from 'constants/tokens';

import convertPriceMantissaToDollars from '..';

describe('utilities/convertPriceMantissaToDollars', () => {
  it('should convert price mantissa to dollars', () => {
    const result = convertPriceMantissaToDollars({
      token: TESTNET_TOKENS.xvs,
      priceMantissa: '1000000000000000000',
    });

    expect(result).toEqual(new BigNumber(1));
  });
});
