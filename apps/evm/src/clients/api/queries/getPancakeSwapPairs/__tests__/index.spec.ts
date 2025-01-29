import type { Token as PSToken } from '@pancakeswap/sdk';
import { BigNumber as BN } from 'ethers';
import type { Mock } from 'vitest';

import fakeProvider from '__mocks__/models/provider';
import fakeTokenCombinations from '__mocks__/models/tokenCombinations';

import { type PancakePairV2, getPancakePairV2Contract } from 'libs/contracts';

import getPancakeSwapPairs from '..';

vi.mock('libs/contracts');

const fakePancakePairV2Contract = {
  getReserves: async () => ({
    reserve0: BN.from('1000000000'),
    reserve1: BN.from('2000000000'),
    blockTimestampLast: 1694182120663,
  }),
} as unknown as PancakePairV2;

describe('api/queries/getPancakeSwapPairs', () => {
  beforeEach(() => {
    (getPancakePairV2Contract as Mock).mockImplementation(() => fakePancakePairV2Contract);
  });

  it('returns pairs in the right format on success', async () => {
    const res = await getPancakeSwapPairs({
      tokenCombinations: fakeTokenCombinations,
      provider: fakeProvider,
    });

    expect(res).toMatchSnapshot();
  });

  it('skips token combinations for which a pair address could not be generated', async () => {
    const customFakeTokenCombinations = [...fakeTokenCombinations];
    customFakeTokenCombinations[0][0] = undefined as unknown as PSToken;

    const res = await getPancakeSwapPairs({
      tokenCombinations: customFakeTokenCombinations,
      provider: fakeProvider,
    });

    expect(res).toMatchSnapshot();
  });
});
