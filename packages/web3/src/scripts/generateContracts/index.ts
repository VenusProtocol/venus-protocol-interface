#!/usr/bin/env tsx
import Handlebars, { compile } from 'handlebars';
import { readFileSync, rmSync } from 'node:fs';
import * as path from 'path';
import { glob, runTypeChain } from 'typechain';

import { ContractConfig, contracts } from 'scripts/generateContracts/config';

import { GENERATED_DIRECTORY_PATH } from '../constants';
import cwd from '../cwd';
import writeFile from '../writeFile';
import { isSwapRouterContractConfig } from './isSwapRouterContractConfig';

// Register Handlebars helper to lowercase the first letter of an expression
Handlebars.registerHelper(
  'lowercaseFirst',
  (text: string) => text.charAt(0).toLowerCase() + text.slice(1),
);

Handlebars.registerHelper('json', (context: object) => JSON.stringify(context));

const TEMPLATES_DIRECTORY = `${__dirname}/templates`;

const uniqueContractTemplateBuffer = readFileSync(
  `${TEMPLATES_DIRECTORY}/uniqueContractTemplate.hbs`,
);
const uniqueContractTemplate = compile(uniqueContractTemplateBuffer.toString());

const genericContractTemplateBuffer = readFileSync(
  `${TEMPLATES_DIRECTORY}/genericContractTemplate.hbs`,
);
const genericContractTemplate = compile(genericContractTemplateBuffer.toString());

const swapRouterContractTemplateBuffer = readFileSync(
  `${TEMPLATES_DIRECTORY}/swapRouterContractTemplate.hbs`,
);
const swapRouterContractTemplate = compile(swapRouterContractTemplateBuffer.toString());

const barrelTemplateBuffer = readFileSync(`${TEMPLATES_DIRECTORY}/barrel.hbs`);
const barrelTemplate = compile(barrelTemplateBuffer.toString());

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
  const abiDirectoryPath = path.join(GENERATED_DIRECTORY_PATH, 'contracts/abis');

  // Extract temporary contract ABIs into separate JSON files
  contracts.forEach(contract => {
    writeFile({
      outputPath: path.join(abiDirectoryPath, `${contract.name}.json`),
      content: JSON.stringify(contract.abi),
    });
  });

  // Generate contract types from ABIs files
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
    content: barrelTemplate({ fileNames }),
  });
};

console.log('Generating contracts');

generate()
  .then(() => console.log(`Finished generating contracts at: ${GENERATED_DIRECTORY_PATH}`))
  .catch(console.error);
