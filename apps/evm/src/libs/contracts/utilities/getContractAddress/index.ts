import { ChainId, bnbChainMainnetFermiUpgradeTimestampMs } from '@venusprotocol/chains';
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

  // TEMPORARY FIX: remove once Fermi upgrade is live
  if (
    input.name === 'VenusLens' &&
    input.chainId === ChainId.BSC_MAINNET &&
    new Date().getTime() > bnbChainMainnetFermiUpgradeTimestampMs
  ) {
    return '0x969a45F1bb5Ba4037CB44664135862D0c2226F89';
  }
  // END TEMPORARY FIX

  const contractAddresses = addresses.uniques[input.name];
  return contractAddresses[input.chainId];
};
