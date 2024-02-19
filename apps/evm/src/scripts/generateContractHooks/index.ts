#!/usr/bin/env tsx
// This is a temporary script to make the link between the web3 package and the evm app whilst we're
// still using ethers.js. Once we've replaced its usage with viem's, we'll be able to get rid of
// this script and directly use ABIs and addresses from the web3 package to perform read/write
// contract transactions.
import { generateBarrelFile, cwd, getTemplate, writeFile } from '@venusprotocol/file-system';
import {
  ContractConfig,
  contracts,
} from '@venusprotocol/web3/src/scripts/generateContracts/config';
import { isSwapRouterContractConfig } from '@venusprotocol/web3/src/scripts/generateContracts/isSwapRouterContractConfig';
import * as path from 'path';

const TEMPLATES_DIRECTORY = `${__dirname}/templates`;
const GENERATED_DIRECTORY_PATH = path.join(cwd(), './src/libs/contracts/generated');

const uniqueContractHookTemplate = getTemplate({
  filePath: `${TEMPLATES_DIRECTORY}/uniqueContractHook.hbs`,
});

const genericContractHookTemplate = getTemplate({
  filePath: `${TEMPLATES_DIRECTORY}/genericContractHook.hbs`,
});

const swapRouterContractHookTemplate = getTemplate({
  filePath: `${TEMPLATES_DIRECTORY}/swapRouterContractHook.hbs`,
});

const generateContractHook = (contractConfig: ContractConfig) => {
  let template = genericContractHookTemplate;

  // Handle SwapRouter contract
  if (isSwapRouterContractConfig(contractConfig)) {
    template = swapRouterContractHookTemplate;
  } else if ('address' in contractConfig) {
    template = uniqueContractHookTemplate;
  }

  const content = template(contractConfig);

  // Generate file
  const outputPath = path.join(GENERATED_DIRECTORY_PATH, `hooks/${contractConfig.name}.ts`);

  writeFile({
    outputPath,
    content,
  });

  return contractConfig.name;
};

const generate = async () => {
  // Generate contract hooks
  const fileNames = await Promise.all(contracts.map(generateContractHook));

  // Generate barrel file
  const outputPath = path.join(GENERATED_DIRECTORY_PATH, 'hooks/index.ts');

  writeFile({
    outputPath,
    content: generateBarrelFile({ fileNames }),
  });

  return outputPath;
};

console.log('Generating contract hooks...');

generate()
  .then(() => console.log(`Finished generating contract hooks at: ${GENERATED_DIRECTORY_PATH}`))
  .catch(console.error);
