#!/usr/bin/env tsx
import { ContractConfig } from 'packages/contractsNew/config';

import { getAbsolutePath } from 'packages/contractsNew/utilities/getAbsolutePath';

import { generateAbis } from './generateAbis';
import { generateAddressList } from './generateAddressList';
import { generateGetters } from './generateGetters';
import { generateTypes } from './generateTypes';

const GETTERS_OUTPUT_DIRECTORY_PATH = getAbsolutePath({
  relativePath: 'generated/getters',
});
const ABIS_OUTPUT_DIRECTORY_PATH = getAbsolutePath({
  relativePath: 'generated/infos/abis',
});
const CONTRACT_TYPES_OUTPUT_DIRECTORY_PATH = getAbsolutePath({
  relativePath: 'generated/infos/contractTypes',
});
const TYPES_OUTPUT_FILE_PATH = getAbsolutePath({
  relativePath: 'generated/infos/types.ts',
});
const ADDRESSES_OUTPUT_FILE_PATH = getAbsolutePath({
  relativePath: 'generated/infos/addresses.ts',
});

export interface GenerateContractsInput {
  contractConfigs: ContractConfig[];
}

export const generateContracts = async ({ contractConfigs }: GenerateContractsInput) => {
  // Generate address list
  console.log('Start generating contract address list...');
  generateAddressList({
    contractConfigs,
    outputFilePath: ADDRESSES_OUTPUT_FILE_PATH,
  });
  console.log('Finished generating contract address list');

  // Generate ABIs
  console.log('Generating contract ABIs...');
  generateAbis({
    contractConfigs,
    outputDirectoryPath: ABIS_OUTPUT_DIRECTORY_PATH,
  });
  console.log('Finished generating contract ABIs...');

  // Generate contract types
  console.log('Generating contract types...');
  await generateTypes({
    contractConfigs,
    abiDirectoryPath: ABIS_OUTPUT_DIRECTORY_PATH,
    typesOutputDirectoryPath: TYPES_OUTPUT_FILE_PATH,
    contractTypesOutputDirectoryPath: CONTRACT_TYPES_OUTPUT_DIRECTORY_PATH,
  });
  console.log('Finished generating contract types');

  // Generate getter functions
  console.log('Generating contract getters...');
  generateGetters({
    contractConfigs,
    outputDirectoryPath: GETTERS_OUTPUT_DIRECTORY_PATH,
  });
  console.log('Finished generating contract getters');
};
