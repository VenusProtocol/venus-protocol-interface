#!/usr/bin/env tsx
import { generateBarrelFile, cwd, getTemplate, writeFile } from '@venusprotocol/file-system';
import { rmSync } from 'node:fs';
import * as path from 'path';
import { glob, runTypeChain } from 'typechain';

import { ContractConfig, contracts } from 'scripts/generateContracts/config';

import { GENERATED_DIRECTORY_PATH } from '../constants';
import { isSwapRouterContractConfig } from './isSwapRouterContractConfig';

const TEMPLATES_DIRECTORY = `${__dirname}/templates`;

const uniqueContractTemplate = getTemplate({
  filePath: `${TEMPLATES_DIRECTORY}/uniqueContractTemplate.hbs`,
});

const genericContractTemplate = getTemplate({
  filePath: `${TEMPLATES_DIRECTORY}/genericContractTemplate.hbs`,
});

const swapRouterContractTemplate = getTemplate({
  filePath: `${TEMPLATES_DIRECTORY}/swapRouterContractTemplate.hbs`,
});

const generateContract = (contractConfig: ContractConfig) => {
  let template = genericContractTemplate;

  // Handle SwapRouter contract
  if (isSwapRouterContractConfig(contractConfig)) {
    template = swapRouterContractTemplate;
  } else if ('address' in contractConfig) {
    template = uniqueContractTemplate;
  }

  const content = template(contractConfig);

  // Generate file
  const outputPath = path.join(GENERATED_DIRECTORY_PATH, `contracts/${contractConfig.name}.ts`);

  writeFile({
    outputPath,
    content,
  });

  return contractConfig.name;
};

const generate = async () => {
  // Extract contract ABIs into temporary separate JSON files
  const abiDirectoryPath = path.join(GENERATED_DIRECTORY_PATH, 'contracts/abis');
  contracts.forEach(contract => {
    writeFile({
      outputPath: path.join(abiDirectoryPath, `${contract.name}.json`),
      content: JSON.stringify(contract.abi),
    });
  });

  // Generate contract types from JSON ABIs
  const processCwd = cwd();
  const abiFiles = glob(processCwd, [`${abiDirectoryPath}/**/+([a-zA-Z0-9_]).json`]);

  await runTypeChain({
    cwd: processCwd,
    filesToProcess: abiFiles,
    allFiles: abiFiles,
    outDir: path.join(GENERATED_DIRECTORY_PATH, 'contracts/types'),
    target: 'ethers-v5',
  });

  // Delete temporary JSON ABIs
  rmSync(abiDirectoryPath, {
    recursive: true,
  });

  // Generate contracts
  const fileNames = await Promise.all(contracts.map(generateContract));

  // Generate barrel file
  const outputPath = path.join(GENERATED_DIRECTORY_PATH, 'contracts/index.ts');

  writeFile({
    outputPath,
    content: generateBarrelFile({ fileNames }),
  });
};

console.log('Generating contracts');

generate()
  .then(() => console.log(`Finished generating contracts at: ${GENERATED_DIRECTORY_PATH}`))
  .catch(console.error);
