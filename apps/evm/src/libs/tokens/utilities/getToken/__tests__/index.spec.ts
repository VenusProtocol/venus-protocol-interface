import { tokens } from 'libs/tokens/infos/commonTokens';
import { ChainId } from 'types';

import { getToken } from '..';

describe('getToken', () => {
  it('return a single token from a chain, given its symbol', () => {
    const result = getToken({
      chainId: ChainId.BSC_TESTNET,
      symbol: 'BNB',
    });

    expect(result).toBe(tokens[ChainId.BSC_TESTNET][3]);
  });
});
