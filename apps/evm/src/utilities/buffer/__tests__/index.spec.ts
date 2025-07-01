import { buffer } from '../index';

describe('buffer', () => {
  it('applies the default bufferPercentage', () => {
    const amount = 98n;
    expect(buffer({ amountMantissa: amount })).toMatchInlineSnapshot('99n');
  });

  it('applies a custom bufferPercentage', () => {
    const amount = 1000n;
    expect(buffer({ amountMantissa: amount, bufferPercentage: 15.83 })).toMatchInlineSnapshot(
      '1159n',
    );
  });
});
