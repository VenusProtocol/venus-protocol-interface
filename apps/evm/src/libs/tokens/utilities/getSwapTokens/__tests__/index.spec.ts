import type { Mock } from 'vitest';

import { busd, vai, vrt, xvs } from '__mocks__/models/tokens';

import { getPancakeSwapTokens } from 'libs/tokens/utilities/getPancakeSwapTokens';
import { getTokens } from 'libs/tokens/utilities/getTokens';
import { ChainId } from 'types';

import { getSwapTokens } from '..';

vi.mock('libs/tokens/utilities/getTokens');
vi.mock('libs/tokens/utilities/getPancakeSwapTokens');

const fakeTokens = [xvs, vai];
const fakePancakeSwapTokens = [vrt, xvs, busd];

describe('getSwapTokens', () => {
  beforeEach(() => {
    (getTokens as Mock).mockImplementation(() => fakeTokens);
    (getPancakeSwapTokens as Mock).mockImplementation(() => fakePancakeSwapTokens);
  });

  it('returns a list of tokens that contains all the tokens listed on Pancake Swap and all the tokens listed on Venus with no duplicates', () => {
    const result = getSwapTokens({
      chainId: ChainId.BSC_TESTNET,
    });

    expect(result).toMatchSnapshot();
  });
});
