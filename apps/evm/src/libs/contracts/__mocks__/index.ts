import type { GetContractAddressInput } from '../utilities/getContractAddress';

export * from '..';

export const getContractAddress = vi.fn(
  (input: GetContractAddressInput) => `0xfake${input.name}ContractAddress`,
);
