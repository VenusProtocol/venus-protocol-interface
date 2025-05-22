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
  let addressesOutput = `export const addresses = {
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
  }`;

  // Generate addresses file
  writeFile({
    outputPath: outputFilePath,
    content: addressesOutput,
  });
};
