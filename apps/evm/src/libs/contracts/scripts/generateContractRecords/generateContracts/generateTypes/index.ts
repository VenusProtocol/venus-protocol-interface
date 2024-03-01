import { compile } from 'handlebars';
import { readFileSync } from 'node:fs';
import { glob, runTypeChain } from 'typechain';

import { ContractConfig } from 'libs/contracts/config';
import { isUniquePerPoolContractConfig } from 'libs/contracts/utilities/isUniquePerPoolContractConfig';
import processCwd from 'utilities/cwd';
import writeFile from 'utilities/writeFile';

const TYPES_TEMPLATE_FILE_PATH = `${__dirname}/typesTemplate.hbs`;

const typesTemplateBuffer = readFileSync(TYPES_TEMPLATE_FILE_PATH);
const typesTemplate = compile(typesTemplateBuffer.toString());

export interface GenerateTypesInput {
  contractConfigs: ContractConfig[];
  abiDirectoryPath: string;
  typesOutputDirectoryPath: string;
  contractTypesOutputDirectoryPath: string;
}

export const generateTypes = async ({
  contractConfigs,
  abiDirectoryPath,
  contractTypesOutputDirectoryPath,
  typesOutputDirectoryPath,
}: GenerateTypesInput) => {
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
    uniquePerPool: string[];
  } = {
    uniques: [],
    generics: [],
    uniquePerPool: [],
  };

  contractConfigs.forEach(contractConfig => {
    if (isUniquePerPoolContractConfig(contractConfig)) {
      contractNames.uniquePerPool.push(contractConfig.name);
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
};
