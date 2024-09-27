import BigNumber from 'bignumber.js';

import getSmartDecimalPlaces from '..';

describe('utilities/getSmartDecimalPlaces', () => {
  it('should work with zero and return 0', () => {
    expect(getSmartDecimalPlaces({ value: new BigNumber('0') })).toBe(0);
  });

  it('should return 0 when number does not contain decimals', () => {
    expect(getSmartDecimalPlaces({ value: new BigNumber('1') })).toBe(0);
  });

  it('should return all decimals when no additional parameters are passed', () => {
    expect(getSmartDecimalPlaces({ value: new BigNumber('1.87123') })).toBe(5);
  });

  it('should trim zeros', () => {
    expect(getSmartDecimalPlaces({ value: new BigNumber('1.871230000') })).toBe(5);
  });

  it('should limit the number of decimal places according to maxDecimalPlaces when passed', () => {
    expect(getSmartDecimalPlaces({ value: new BigNumber('1.00004123'), maxDecimalPlaces: 5 })).toBe(
      5,
    );

    expect(
      getSmartDecimalPlaces({ value: new BigNumber('1.00004123000'), maxDecimalPlaces: 5 }),
    ).toBe(5);

    expect(getSmartDecimalPlaces({ value: new BigNumber('1.00004123'), maxDecimalPlaces: 2 })).toBe(
      0,
    );
  });
});
