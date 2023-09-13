import { getVenusTokens } from '..';
import { venusTokens } from '../../tokenInfos/common';

describe('getVenusTokens', () => {
  it('returns all the tokens relevant to the passed chain ID', () => {
    const CHAIN_ID = 56;
    const result = getVenusTokens({
      chainId: CHAIN_ID,
    });

    expect(result).toBe(venusTokens[CHAIN_ID]);
  });
});
