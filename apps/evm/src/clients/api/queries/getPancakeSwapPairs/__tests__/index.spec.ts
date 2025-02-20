import type { Token as PSToken } from '@pancakeswap/sdk';
import fakeTokenCombinations from '__mocks__/models/tokenCombinations';
import type { PublicClient } from 'viem';
import type { Mock } from 'vitest';

import { getPancakePairV2Contract } from 'libs/contracts';

import getPancakeSwapPairs from '..';

vi.mock('libs/contracts');

const multicallFn = ({ contracts }: { contracts: { address: string }[] }) =>
  contracts.map(_c => ({
    result: [1000000000n, 2000000000n, 1694182120663n],
  }));

describe('api/queries/getPancakeSwapPairs', () => {
  beforeEach(() => {
    (getPancakePairV2Contract as Mock).mockReturnValue({});
  });

  it('returns pairs in the right format on success', async () => {
    const multicallMock = vi.fn(multicallFn);

    const mockPublicClient = {
      multicall: multicallMock,
    } as unknown as PublicClient;

    const res = await getPancakeSwapPairs({
      tokenCombinations: fakeTokenCombinations,
      publicClient: mockPublicClient,
    });

    expect(res).toMatchSnapshot();
  });

  it('skips token combinations for which a pair address could not be generated', async () => {
    const multicallMock = vi.fn(multicallFn);

    const mockPublicClient = {
      multicall: multicallMock,
    } as unknown as PublicClient;

    const customFakeTokenCombinations = [...fakeTokenCombinations];
    customFakeTokenCombinations[0][0] = undefined as unknown as PSToken;

    const res = await getPancakeSwapPairs({
      tokenCombinations: customFakeTokenCombinations,
      publicClient: mockPublicClient,
    });

    expect(res).toMatchSnapshot();
  });
});
