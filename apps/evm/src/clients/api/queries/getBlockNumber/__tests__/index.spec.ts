import type { PublicClient } from 'viem';
import getBlockNumber from '..';

describe('getBlockNumber', () => {
  test('returns the latest block number on success', async () => {
    const fakeBlockNumber = 123456789;
    const getBlockNumberMock = vi.fn(async () => fakeBlockNumber);

    const fakePublicClient = {
      getBlockNumber: getBlockNumberMock,
    } as unknown as PublicClient;

    const res = await getBlockNumber({ publicClient: fakePublicClient });

    expect(res).toStrictEqual({
      blockNumber: fakeBlockNumber,
    });
  });
});
