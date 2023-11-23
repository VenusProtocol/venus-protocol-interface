import { providers } from 'ethers';

const fakeProvider = new providers.JsonRpcProvider();
export const useProvider = vi.fn(() => ({
  provider: fakeProvider,
}));
