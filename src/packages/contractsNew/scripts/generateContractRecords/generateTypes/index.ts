import * as fs from 'fs';
import { compile } from 'handlebars';
import { ContractConfig } from 'packages/contractsNew/config';
import { glob, runTypeChain } from 'typechain';

import isSwapRouterContractConfig from 'packages/contractsNew/utilities/isSwapRouterContractConfig';
import processCwd from 'utilities/cwd';
import writeFile from 'utilities/writeFile';

const TYPES_TEMPLATE_FILE_PATH = `${__dirname}/typesTemplate.hbs`;

const typesTemplateBuffer = fs.readFileSync(TYPES_TEMPLATE_FILE_PATH);
const typesTemplate = compile(typesTemplateBuffer.toString());

export interface GenerateTypesInput {
  contractConfigs: ContractConfig[];
  abiDirectoryPath: string;
  typesOutputDirectoryPath: string;
  contractTypesOutputDirectoryPath: string;
}

const generateTypes = async ({
  contractConfigs,
  abiDirectoryPath,
  contractTypesOutputDirectoryPath,
  typesOutputDirectoryPath,
}: GenerateTypesInput) => {
  console.log('Generating contract types...');

  // Generate individual contract types
  const cwd = processCwd();
  const abiFiles = glob(cwd, [`${abiDirectoryPath}/**/+([a-zA-Z0-9_]).json`]);

  await runTypeChain({
    cwd,
    filesToProcess: abiFiles,
    allFiles: abiFiles,
    outDir: contractTypesOutputDirectoryPath,
    target: 'ethers-v5',
  });

  // Extract contract names into union types
  const contractNames: {
    uniques: string[];
    generics: string[];
    swapRouter: string;
  } = {
    uniques: [],
    generics: [],
    swapRouter: '',
  };

  contractConfigs.forEach(contractConfig => {
    if (isSwapRouterContractConfig(contractConfig)) {
      contractNames.swapRouter = contractConfig.name;
    } else if ('address' in contractConfig) {
      contractNames.uniques.push(contractConfig.name);
    } else {
      contractNames.generics.push(contractConfig.name);
    }
  });

  const typesOutput = typesTemplate(contractNames);

  writeFile({
    outputPath: typesOutputDirectoryPath,
    content: typesOutput,
  });

  console.log('Finished generating contract types');
};

export default generateTypes;
