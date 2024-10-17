import fakeContractTransaction from '__mocks__/models/contractTransaction';

export const useSendContractTransaction = vi.fn(() => vi.fn(() => fakeContractTransaction));
