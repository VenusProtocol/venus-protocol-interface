import Vi from 'vitest';

import { busd, vai, vrt, xvs } from '__testUtils__/fakeTokens';

import { ChainId } from 'types';
import { getTokens } from 'utilities/getTokens';

import { getSwapTokens } from '..';
import { getPancakeSwapTokens } from '../getPancakeSwapTokens';

vi.mock('utilities/getTokens');
vi.mock('../getPancakeSwapTokens');

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
