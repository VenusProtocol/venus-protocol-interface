import { convertPercentageToBps } from '..';

describe('convertPercentageToBps', () => {
  it('converts whole percentages to bps', () => {
    expect(convertPercentageToBps({ percentage: 50 })).toBe(5000n);
  });

  it('converts decimal percentages to bps', () => {
    expect(convertPercentageToBps({ percentage: 12.34 })).toBe(1234n);
  });
});
