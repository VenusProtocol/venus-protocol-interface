import type { Mock } from 'vitest';

import { bnb, busd, vai, vrt, xvs } from '__mocks__/models/tokens';

import { getPancakeSwapTokens } from 'libs/tokens/utilities/getPancakeSwapTokens';
import { ChainId } from 'types';

import { getSwapTokens } from '..';

vi.mock('libs/tokens/utilities/getPancakeSwapTokens');

const fakePancakeSwapTokens = [vrt, xvs, busd];

vi.mock('@venusprotocol/chains', async () => {
  const actual = (await vi.importActual('@venusprotocol/chains')) as any;

  return {
    ...actual,
    tokens: {
      97: [bnb, vai],
    },
  };
});

describe('getSwapTokens', () => {
  beforeEach(() => {
    (getPancakeSwapTokens as Mock).mockImplementation(() => fakePancakeSwapTokens);
  });

  it('returns a list of tokens that contains all the tokens listed on Pancake Swap and all the tokens listed on Venus with no duplicates', () => {
    const result = getSwapTokens({
      chainId: ChainId.BSC_TESTNET,
    });

    expect(result).toMatchSnapshot();
  });
});
