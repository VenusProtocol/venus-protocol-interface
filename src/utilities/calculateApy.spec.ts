import BigNumber from 'bignumber.js';
import calculateApy from './calculateApy';

describe('utilities/calculateApy', () => {
  test('calculates apy from balance and yearly earnings', () => {
    const apy = calculateApy({
      yearlyEarningsCents: new BigNumber('1924.21991227022443813375'),
      supplyBalanceCents: new BigNumber('21507.4246'),
    });
    expect(apy).toBe(0.09);
  });
});
