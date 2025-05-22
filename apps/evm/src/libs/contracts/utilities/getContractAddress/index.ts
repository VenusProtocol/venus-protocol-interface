import type { ChainId } from '@venusprotocol/chains';
import { addresses } from 'libs/contracts/generated/addresses';
import type { Address } from 'viem';

export type UniqueContractName = keyof typeof addresses.uniques;
export type UniquePerPoolContractName = keyof typeof addresses.uniquesPerPool;

export type GetUniqueContractAddressInput = {
  name: UniqueContractName;
  chainId: ChainId;
};

export type GetUniquePerPoolContractAddressInput = {
  name: UniquePerPoolContractName;
  chainId: ChainId;
  poolComptrollerContractAddress: string;
};

export type GetContractAddressInput =
  | GetUniqueContractAddressInput
  | GetUniquePerPoolContractAddressInput;

export const getContractAddress = (input: GetContractAddressInput) => {
  if ('poolComptrollerContractAddress' in input) {
    const contractAddressesByPool =
      addresses.uniquesPerPool[input.name as keyof typeof addresses.uniquesPerPool];

    const contractAddresses =
      contractAddressesByPool[input.chainId as keyof typeof contractAddressesByPool];

    return contractAddresses[input.chainId as keyof typeof contractAddresses] as
      | Address
      | undefined;
  }

  const contractAddresses = addresses.uniques[input.name as keyof typeof addresses.uniques];
  return contractAddresses[input.chainId as keyof typeof contractAddresses];
};
