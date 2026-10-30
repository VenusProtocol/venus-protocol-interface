import BigNumber from 'bignumber.js';

import { liquidityHubs } from '__mocks__/models/liquidityHubs';

import { convertVhTokensToUnderlying } from '..';

describe('convertVhTokensToUnderlying', () => {
  it('converts vhTokens to the underlying token at the price per share', () => {
    expect(
      convertVhTokensToUnderlying({
        vhTokens: new BigNumber(3),
        liquidityHub: { ...liquidityHubs[0], pricePerShare: new BigNumber(1.5) },
      }).toFixed(),
    ).toBe('4.5');
  });

  it('rounds down to the underlying token decimals', () => {
    const liquidityHub = { ...liquidityHubs[0], pricePerShare: new BigNumber(1) };
    const { decimals } = liquidityHub.vhToken.underlyingToken;

    expect(
      convertVhTokensToUnderlying({
        vhTokens: new BigNumber(1).dividedBy(3),
        liquidityHub,
      }).decimalPlaces(),
    ).toBe(decimals);
  });
});
