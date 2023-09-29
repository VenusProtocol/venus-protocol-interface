import { tokens } from 'packages/tokens/tokenInfos/commonTokens';

import { getTokens } from '..';

describe('getTokens', () => {
  it('returns all the tokens relevant to the passed chain ID', () => {
    const CHAIN_ID = 56;
    const result = getTokens({
      chainId: CHAIN_ID,
    });

    expect(result).toBe(tokens[CHAIN_ID]);
  });
});
