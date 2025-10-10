import type { Mock } from 'vitest';

import { busd, vrt, xvs } from '__mocks__/models/tokens';

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
      97: [
        {
          address: '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
          decimals: 18,
          symbol: 'XVS',
          asset: 'fake-xvs-asset',
        },
        {
          address: '0x5fFbE5302BadED40941A403228E6AD03f93752d9',
          decimals: 18,
          symbol: 'VAI',
          asset: 'fake-vai-asset',
        },
      ],
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
