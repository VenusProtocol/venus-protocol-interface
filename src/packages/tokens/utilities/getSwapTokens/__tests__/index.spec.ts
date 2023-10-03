import { ChainId } from 'types';
import Vi from 'vitest';

import { busd, vai, vrt, xvs } from '__mocks__/models/tokens';
import { getPancakeSwapTokens } from 'packages/tokens/utilities/getPancakeSwapTokens';
import { getTokens } from 'packages/tokens/utilities/getTokens';

import { getSwapTokens } from '..';

vi.mock('packages/tokens/utilities/getTokens');
vi.mock('packages/tokens/utilities/getPancakeSwapTokens');

const fakeTokens = [xvs, vai];
const fakePancakeSwapTokens = [vrt, xvs, busd];

describe('getSwapTokens', () => {
  beforeEach(() => {
    (getTokens as Vi.Mock).mockImplementation(() => fakeTokens);
    (getPancakeSwapTokens as Vi.Mock).mockImplementation(() => fakePancakeSwapTokens);
  });

  it('returns a list of tokens that contains all the tokens listed on Pancake Swap and all the tokens listed on Venus with no duplicates', () => {
    const result = getSwapTokens({
      chainId: ChainId.BSC_TESTNET,
    });

    expect(result).toMatchSnapshot();
  });
});
