import { Token as PSToken } from '@pancakeswap/sdk/dist/index.js';
import { BigNumber as BN } from 'ethers';
import Vi from 'vitest';

import fakeProvider from '__mocks__/models/provider';
import fakeTokenCombinations from '__mocks__/models/tokenCombinations';

import { PancakePairV2, getPancakePairV2Contract } from 'packages/contracts';

import getPancakeSwapPairs from '..';

vi.mock('packages/contracts');

const fakePancakePairV2Contract = {
  getReserves: async () => ({
    reserve0: BN.from('1000000000'),
    reserve1: BN.from('2000000000'),
    blockTimestampLast: 1694182120663,
  }),
} as unknown as PancakePairV2;

describe('api/queries/getPancakeSwapPairs', () => {
  beforeEach(() => {
    (getPancakePairV2Contract as Vi.Mock).mockImplementation(() => fakePancakePairV2Contract);
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
