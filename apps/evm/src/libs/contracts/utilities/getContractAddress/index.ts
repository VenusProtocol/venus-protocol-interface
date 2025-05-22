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
  poolComptrollerContractAddress: Address;
};

export type GetContractAddressInput =
  | GetUniqueContractAddressInput
  | GetUniquePerPoolContractAddressInput;

export const getContractAddress = (input: GetContractAddressInput) => {
  if ('poolComptrollerContractAddress' in input) {
    const contractAddressesByPool = addresses.uniquesPerPool[input.name];

    const contractAddresses = contractAddressesByPool[input.chainId];

    return contractAddresses
      ? contractAddresses[
          input.poolComptrollerContractAddress.toLowerCase() as keyof typeof contractAddresses
        ]
      : undefined;
  }

  const contractAddresses = addresses.uniques[input.name];
  return contractAddresses[input.chainId];
};
