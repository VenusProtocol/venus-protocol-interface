#!/usr/bin/env tsx
import { contracts } from 'packages/contractsNew/config';

import getAbsolutePath from 'packages/contractsNew/utilities/getAbsolutePath';

import generateAbis from './generateAbis';
import generateAddressList from './generateAddressList';
import generateGetters from './generateGetters';
import generateTypes from './generateTypes';

const GETTERS_OUTPUT_DIRECTORY_PATH = getAbsolutePath({
  relativePath: 'getters',
});
const ABIS_OUTPUT_DIRECTORY_PATH = getAbsolutePath({
  relativePath: 'infos/abis',
});
const CONTRACT_TYPES_OUTPUT_DIRECTORY_PATH = getAbsolutePath({
  relativePath: 'infos/contractTypes',
});
const TYPES_OUTPUT_FILE_PATH = getAbsolutePath({
  relativePath: 'infos/types.ts',
});
const ADDRESSES_OUTPUT_FILE_PATH = getAbsolutePath({
  relativePath: 'infos/addresses.ts',
});

const generateContracts = async () => {
  // Generate address list
  generateAddressList({
    contractConfigs: contracts,
    outputFilePath: ADDRESSES_OUTPUT_FILE_PATH,
  });

  // Generate ABIs
  generateAbis({
    contractConfigs: contracts,
    outputDirectoryPath: ABIS_OUTPUT_DIRECTORY_PATH,
  });

  // Generate contract types
  await generateTypes({
    contractConfigs: contracts,
    abiDirectoryPath: ABIS_OUTPUT_DIRECTORY_PATH,
    typesOutputDirectoryPath: TYPES_OUTPUT_FILE_PATH,
    contractTypesOutputDirectoryPath: CONTRACT_TYPES_OUTPUT_DIRECTORY_PATH,
  });

  // Generate getter functions
  generateGetters({
    contractConfigs: contracts,
    outputDirectoryPath: GETTERS_OUTPUT_DIRECTORY_PATH,
  });
};

console.log('Generating contracts...');

generateContracts()
  .then(() => console.log('Finished generating contracts'))
  .catch(console.error);
