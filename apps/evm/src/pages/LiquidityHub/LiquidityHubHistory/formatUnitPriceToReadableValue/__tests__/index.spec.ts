import BigNumber from 'bignumber.js';

import { formatUnitPriceToReadableValue } from '..';

describe('formatUnitPriceToReadableValue', () => {
  it.each([
    {
      input: 1,
      expectedOutput: '1',
    },
    {
      input: new BigNumber('1.01976'),
      expectedOutput: '1.0197',
    },
  ])('formats $input with up to four decimal places', ({ input, expectedOutput }) => {
    expect(formatUnitPriceToReadableValue(input)).toBe(expectedOutput);
  });
});
