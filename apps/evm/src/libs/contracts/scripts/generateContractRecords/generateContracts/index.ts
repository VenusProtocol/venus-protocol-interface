#!/usr/bin/env tsx
import type { ContractConfig } from 'libs/contracts/config';
import { getAbsolutePath } from 'libs/contracts/utilities/getAbsolutePath';
import { generateAbis } from './generateAbis';
import { generateAddressList } from './generateAddressList';

const ABIS_OUTPUT_DIRECTORY_PATH = getAbsolutePath({
  relativePath: 'generated/abis',
});
const ADDRESSES_OUTPUT_FILE_PATH = getAbsolutePath({
  relativePath: 'generated/addresses.ts',
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
};
