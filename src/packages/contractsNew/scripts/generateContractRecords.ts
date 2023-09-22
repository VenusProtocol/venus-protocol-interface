#!/usr/bin/env tsx
import * as fs from 'fs';
import * as path from 'path';
import { glob, runTypeChain } from 'typechain';

import { contracts } from './config';

const CONTRACTS_PACKAGE_PATH = './src/packages/contractsNew/generated';
const ADDRESSES_FILE_PATH = `${CONTRACTS_PACKAGE_PATH}/contractInfos/addresses.ts`;
const ABIS_DIRECTORY_PATH = `${CONTRACTS_PACKAGE_PATH}/contractInfos/abis`;
const TYPES_DIRECTORY_PATH = `${CONTRACTS_PACKAGE_PATH}/contractInfos/types`;

const generateContractRecords = async () => {
  console.log('Extracting contract infos...');

  // Open addresses output
  let addressesOutput = 'export default {';

  // Create directories
  await fs.promises.mkdir(ABIS_DIRECTORY_PATH, { recursive: true });
  await fs.promises.mkdir(TYPES_DIRECTORY_PATH, { recursive: true });

  // Go through config and extract ABIs and contract addresses
  contracts.forEach(contractConfig => {
    // Write ABI into a separate file
    const abiOutput = JSON.stringify(contractConfig.abi);
    const abiOutputFilePath = path.join(
      process.cwd(),
      `${ABIS_DIRECTORY_PATH}/${contractConfig.name}.json`,
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
  addressesOutput += '};';

  // Write addresses file
  const addressesOutputFilePath = path.join(process.cwd(), ADDRESSES_FILE_PATH);
  fs.writeFileSync(addressesOutputFilePath, addressesOutput, 'utf8');

  console.log('Finished extracting contract infos');

  // Generate contract types
  console.log('Generating contract types...');

  const cwd = process.cwd();
  // find all files matching the glob
  const allFiles = glob(cwd, [`${ABIS_DIRECTORY_PATH}/**/+([a-zA-Z0-9_]).json`]);

  await runTypeChain({
    cwd,
    filesToProcess: allFiles,
    allFiles,
    outDir: TYPES_DIRECTORY_PATH,
    target: 'ethers-v5',
  });

  console.log('Finished generating contract types');

  // TODO: generate contract functions

  // TODO: prettify generated files
};

console.log('Generating contracts...');

generateContractRecords()
  .then(() => console.log(`Finished generating contracts at: ${CONTRACTS_PACKAGE_PATH}`))
  .catch(console.error);
