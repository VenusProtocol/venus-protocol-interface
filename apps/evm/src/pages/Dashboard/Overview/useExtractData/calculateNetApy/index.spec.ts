import BigNumber from 'bignumber.js';

import calculateNetApy from '.';

describe('utilities/calculateNetApy', () => {
  test('calculates apy from balance and yearly earnings', () => {
    const apy = calculateNetApy({
      yearlyEarningsCents: new BigNumber('1924.21991227022443813375'),
      supplyBalanceCents: new BigNumber('21507.4246'),
    });
    expect(apy).toBe(8.94);
  });
});
