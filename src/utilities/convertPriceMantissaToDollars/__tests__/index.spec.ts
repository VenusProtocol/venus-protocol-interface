import BigNumber from 'bignumber.js';

import { xvs } from '__mocks__/models/tokens';

import convertPriceMantissaToDollars from '..';

describe('utilities/convertPriceMantissaToDollars', () => {
  it('should convert price mantissa to dollars', () => {
    const result = convertPriceMantissaToDollars({
      token: xvs,
      priceMantissa: '1000000000000000000',
    });

    expect(result).toEqual(new BigNumber(1));
  });
});
