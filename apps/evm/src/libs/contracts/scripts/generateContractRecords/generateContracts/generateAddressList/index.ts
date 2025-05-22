import type {
  ContractConfig,
  UniqueContractConfig,
  UniquePerPoolContractConfig,
} from 'libs/contracts/config';
import writeFile from 'utilities/writeFile';

export interface GenerateAddressListInput {
  outputFilePath: string;
  contractConfigs: ContractConfig[];
}

export const generateAddressList = async ({
  outputFilePath,
  contractConfigs,
}: GenerateAddressListInput) => {
  // Sort contract configs
  const sortedConfig: {
    uniques: UniqueContractConfig[];
    uniquesPerPool: UniquePerPoolContractConfig[];
  } = {
    uniques: [],
    uniquesPerPool: [],
  };

  contractConfigs.forEach(contractConfig => {
    // Ignore generic contracts
    if (!('address' in contractConfig)) {
      return;
    }

    const firstContractAddress = Object.entries(contractConfig.address)[0];
    const firstContractAddressValue = firstContractAddress[1];

    if (typeof firstContractAddressValue === 'string') {
      sortedConfig.uniques.push(contractConfig as UniqueContractConfig);
    } else {
      sortedConfig.uniquesPerPool.push(contractConfig as UniquePerPoolContractConfig);
    }
  });

  // Open addresses output
  let addressesOutput = 'import type { ChainId } from "types";\n';
  addressesOutput += 'import type { Address } from "viem";\n';
  addressesOutput += 'type MapChainIdToAddress = Partial<{ [chainId in ChainId]: Address }>;\n';
  addressesOutput +=
    'type MapChainIdToPoolAddress = Partial<{ [chainId in ChainId]: Record<Address, Address> }>;\n';
  addressesOutput += `type Unique = {${sortedConfig.uniques
    .map(({ name }) => `${name}: MapChainIdToAddress`)
    .join(', ')}};\n`;
  addressesOutput += `type UniquePerPool = {${sortedConfig.uniquesPerPool
    .map(({ name }) => `${name}: MapChainIdToPoolAddress`)
    .join(', ')}};\n`;
  addressesOutput += 'type Addresses = { uniques: Unique, uniquesPerPool: UniquePerPool }\n';
  addressesOutput += `export const addresses: Addresses = {
    uniques: {`;

  sortedConfig.uniques.forEach(config => {
    addressesOutput += `${config.name}: {
      ${Object.entries(config.address)
        .map(([chainId, address]) => `${chainId}: '${address}',`)
        .join('')}
    },`;
  });

  addressesOutput += `},
    uniquesPerPool: {
  `;

  sortedConfig.uniquesPerPool.forEach(config => {
    addressesOutput += `${config.name}: {
      ${Object.entries(config.address)
        .map(
          ([chainId, address]) =>
            `${chainId}: {${Object.entries(address)
              .map(
                ([comptrollerContractAddress, uniquePerPoolContractAddress]) =>
                  `'${comptrollerContractAddress}': '${uniquePerPoolContractAddress}',`,
              )
              .join('')}},`,
        )
        .join('')}
    },`;
  });

  // Close addresses output
  addressesOutput += `
    },
  } as const`;

  // Generate addresses file
  writeFile({
    outputPath: outputFilePath,
    content: addressesOutput,
  });
};
