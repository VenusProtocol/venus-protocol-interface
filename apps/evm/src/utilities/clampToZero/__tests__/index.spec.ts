import BigNumber from 'bignumber.js';
import { clampToZero } from '..';

describe('clampToZero', () => {
  it('clamps value to zero', () => {
    expect(
      clampToZero({
        value: new BigNumber(-1),
      }).toNumber(),
    ).toBe(0);

    expect(
      clampToZero({
        value: new BigNumber(10),
      }).toNumber(),
    ).toBe(10);
  });
});
