import BigNumber from 'bignumber.js';

import { calculateApy } from '..';

describe('calculateApy', () => {
  it('should calculate APY for given daily distributed tokens and decimals', () => {
    const dailyRate = new BigNumber(1.05);

    expect(calculateApy({ dailyRate })).toMatchInlineSnapshot(
      '"3.0088838570689378376402923428334853226083813603702764092454379300788830115159224851071954330964370491947584154357200334333273186688022e+115"',
    );
  });
});
