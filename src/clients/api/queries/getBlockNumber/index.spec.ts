import type { Provider } from '@wagmi/core';

import getBlockNumber from '.';

describe('api/queries/getBlockNumber', () => {
  test('returns the latest block number on success', async () => {
    const fakeBlockNumber = 123456789;

    const fakeProvider = {
      getBlockNumber: async () => fakeBlockNumber,
    } as unknown as Provider;

    const res = await getBlockNumber({ provider: fakeProvider });

    expect(res).toStrictEqual({
      blockNumber: fakeBlockNumber,
    });
  });
});
