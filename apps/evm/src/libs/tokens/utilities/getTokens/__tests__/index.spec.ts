import { tokens } from 'libs/tokens/infos/commonTokens';

import { ChainId } from 'types';

import { getTokens } from '..';

describe('getTokens', () => {
  it('returns all the tokens relevant to the passed chain ID', () => {
    const result = getTokens({
      chainId: ChainId.BSC_TESTNET,
    });

    expect(result).toBe(tokens[ChainId.BSC_TESTNET]);
  });
});
