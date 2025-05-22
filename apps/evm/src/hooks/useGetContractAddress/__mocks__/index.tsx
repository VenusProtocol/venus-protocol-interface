import type { UseGetContractAddressInput } from '..';

export const useGetContractAddress = vi.fn((input: UseGetContractAddressInput) => ({
  address: `0xfake${input.name}ContractAddress`,
}));
