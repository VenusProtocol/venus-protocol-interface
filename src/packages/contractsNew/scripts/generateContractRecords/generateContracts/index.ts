#!/usr/bin/env tsx
import { ContractConfig, contracts } from 'packages/contractsNew/config';

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

export interface GenerateContractsInput {
  contractConfigs: ContractConfig[];
}

const generateContracts = async ({ contractConfigs }: GenerateContractsInput) => {
  // Generate address list
  generateAddressList({
    contractConfigs,
    outputFilePath: ADDRESSES_OUTPUT_FILE_PATH,
  });

  // Generate ABIs
  generateAbis({
    contractConfigs,
    outputDirectoryPath: ABIS_OUTPUT_DIRECTORY_PATH,
  });

  // Generate contract types
  await generateTypes({
    contractConfigs,
    abiDirectoryPath: ABIS_OUTPUT_DIRECTORY_PATH,
    typesOutputDirectoryPath: TYPES_OUTPUT_FILE_PATH,
    contractTypesOutputDirectoryPath: CONTRACT_TYPES_OUTPUT_DIRECTORY_PATH,
  });

  // Generate getter functions
  generateGetters({
    contractConfigs,
    outputDirectoryPath: GETTERS_OUTPUT_DIRECTORY_PATH,
  });
};

export default generateContracts;
