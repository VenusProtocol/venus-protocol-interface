#!/usr/bin/env tsx
import * as fs from 'fs';
import * as path from 'path';

import { contracts } from './config';

const CONTRACTS_PACKAGE_PATH = './src/packages/contractsNew/generated';

const generateContractRecords = async () => {
  console.log('Extracting contract infos...');

  // Open addresses output
  let addressesOutput = `
    export default {
  `;

  // Create directories
  await fs.promises.mkdir(`${CONTRACTS_PACKAGE_PATH}/contractInfos/abis`, { recursive: true });

  // Go through config and extract ABIs and contract addresses
  contracts.forEach(contractConfig => {
    // Extract ABI into a separate file
    const abiOutput = `export default ${JSON.stringify(contractConfig.abi)};`;

    const abiOutputFilePath = path.join(
      process.cwd(),
      `${CONTRACTS_PACKAGE_PATH}/contractInfos/abis/${contractConfig.name}.ts`,
    );
    fs.writeFileSync(abiOutputFilePath, abiOutput, 'utf8');

    // Add address to list
    if (contractConfig.name === 'SwapRouter') {
      // TODO: add logic
      return;
    }

    if ('address' in contractConfig) {
      addressesOutput += `${contractConfig.name}: {
        ${Object.entries(contractConfig.address)
          .map(
            ([chainId, address]) => `
          ${chainId}: '${address}'`,
          )
          .join(',')}
      },
      `;
    }
  });

  // Close addresses output
  addressesOutput += `
    };
  `;

  const addressesOutputFilePath = path.join(
    process.cwd(),
    `${CONTRACTS_PACKAGE_PATH}/contractInfos/addresses.ts`,
  );
  fs.writeFileSync(addressesOutputFilePath, addressesOutput, 'utf8');

  console.log('Finished extracting contracts infos');

  // TODO: generate contract types

  // TODO: generate contract functions

  // TODO: prettify generated files
};

console.log('Generating contracts...');

generateContractRecords()
  .then(() => console.log(`Finished generating contracts at: ${CONTRACTS_PACKAGE_PATH}`))
  .catch(console.error);
