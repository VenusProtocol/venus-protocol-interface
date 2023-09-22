#!/usr/bin/env tsx
import { glob, runTypeChain } from 'typechain';

import getAbsolutePath from 'packages/contractsNew/utilities/getAbsolutePath';
import writeFile from 'utilities/writeFile';

import { contracts } from '../../config';
import generateContractGetters from './generateContractGetters';

const GETTERS_DIRECTORY_PATH = getAbsolutePath({
  relativePath: 'getters',
});
const ABIS_DIRECTORY_PATH = getAbsolutePath({
  relativePath: 'infos/abis',
});
const TYPES_DIRECTORY_PATH = getAbsolutePath({
  relativePath: 'infos/types',
});
const ADDRESSES_FILE_PATH = getAbsolutePath({
  relativePath: 'infos/addresses.ts',
});

const generateContractRecords = async () => {
  console.log('Generating contract ABIs, addresses and functions...');

  // Open addresses output
  let addressesOutput = 'export default {';

  // Go through config and extract ABIs and contract addresses
  contracts.forEach(contractConfig => {
    // Write ABI into a separate file
    writeFile({
      outputPath: `${ABIS_DIRECTORY_PATH}/${contractConfig.name}.json`,
      content: JSON.stringify(contractConfig.abi),
    });

    // Add address to list
    if (!('address' in contractConfig)) {
      return;
    }

    // Generate getter functions
    generateContractGetters({
      contractConfig,
      directoryPath: GETTERS_DIRECTORY_PATH,
    });

    addressesOutput += `${contractConfig.name}: {
      ${Object.entries(contractConfig.address)
        .map(([chainId, address]) => {
          // TODO: handle SwapRouter contract
          // // Handle object addresses (e.g.: SwapRouter contract)
          // formattedAddressOutput = `{${Object.entries(address)
          //   .map(
          //     ([comptrollerContractAddress, swapRouterContractAddress]) =>
          //       `'${comptrollerContractAddress}': '${swapRouterContractAddress}',`,
          //   )
          //   .join('')}}`;

          return `${chainId}: '${address}',`;
        })
        .join('')}
    },
    `;
  });

  // Close addresses output
  addressesOutput += '};';

  // Generate addresses file
  writeFile({
    outputPath: ADDRESSES_FILE_PATH,
    content: addressesOutput,
  });

  console.log('Finished generating contract ABIs, addresses and functions');

  // Generate contract types
  console.log('Generating contract types...');

  const cwd = process.cwd();
  const abiFiles = glob(cwd, [`${ABIS_DIRECTORY_PATH}/**/+([a-zA-Z0-9_]).json`]);

  await runTypeChain({
    cwd,
    filesToProcess: abiFiles,
    allFiles: abiFiles,
    outDir: TYPES_DIRECTORY_PATH,
    target: 'ethers-v5',
  });

  console.log('Finished generating contract types');
};

console.log('Generating contracts...');

generateContractRecords()
  .then(() => console.log('Finished generating contracts'))
  .catch(console.error);
