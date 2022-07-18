import Web3 from 'web3';

import getBlockNumber from '.';

describe('api/queries/getBlockNumber', () => {
  test('calls passed web3 object correctly and returns the latest block number on success', async () => {
    const fakeBlockNumber = 123456789;

    const fakeWeb3 = {
      eth: {
        getBlockNumber: async () => fakeBlockNumber,
      },
    } as unknown as Web3;

    const res = await getBlockNumber({ web3: fakeWeb3 });

    expect(res).toStrictEqual({
      blockNumber: fakeBlockNumber,
    });
  });
});
