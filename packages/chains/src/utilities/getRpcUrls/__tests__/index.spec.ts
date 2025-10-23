import { getRpcUrls } from '..';

describe('getRpcUrls', async () => {
  it('returns RPC URLs for all chains', () => {
    expect(
      getRpcUrls({
        nodeRealApiKey: 'fake-node-real-api-key',
        alchemyApiKey: 'fake-alchemy-api-key',
      }),
    ).toMatchSnapshot();
  });
});
