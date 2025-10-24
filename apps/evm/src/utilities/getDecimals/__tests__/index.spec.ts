import { getDecimals } from '..';

describe('getDecimals', () => {
  it('returns the correct number of decimals', () => {
    expect(
      getDecimals({
        value: 1.09,
      }),
    ).toBe(2);

    expect(
      getDecimals({
        value: '817923.7891623',
      }),
    ).toBe(7);
  });
});
