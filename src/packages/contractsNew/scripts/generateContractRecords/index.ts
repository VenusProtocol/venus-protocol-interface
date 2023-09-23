#!/usr/bin/env tsx
import { glob, runTypeChain } from 'typechain';

import getAbsolutePath from 'packages/contractsNew/utilities/getAbsolutePath';
import writeFile from 'utilities/writeFile';

import { contracts } from '../../config';
import generateAbis from './generateAbis';
import generateAddressList from './generateAddressList';
import generateGetters from './generateGetters';
import generateTypes from './generateTypes';

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

const generateContracts = async () => {
  // Generate address list
  generateAddressList({
    contractConfigs: contracts,
    outputFilePath: ADDRESSES_FILE_PATH,
  });

  // Generate ABIs
  generateAbis({
    contractConfigs: contracts,
    outputDirectoryPath: ABIS_DIRECTORY_PATH,
  });

  // Generate contract types
  await generateTypes({
    abiDirectoryPath: ABIS_DIRECTORY_PATH,
    outputDirectoryPath: TYPES_DIRECTORY_PATH,
  });

  // Generate getter functions
  generateGetters({
    contractConfigs: contracts,
    outputDirectoryPath: GETTERS_DIRECTORY_PATH,
  });
};

console.log('Generating contracts...');

generateContracts()
  .then(() => console.log('Finished generating contracts'))
  .catch(console.error);
