import * as fs from 'fs';
import { compile } from 'handlebars';
import { ContractConfig } from 'packages/contractsNew/config';

import getAbsolutePath from 'packages/contractsNew/utilities/getAbsolutePath';
import writeFile from 'utilities/writeFile';

const TEMPLATES_DIRECTORY = getAbsolutePath({
  relativePath: 'scripts/generateContractRecords/generateGetters/templates',
});

const uniqueContractGettersTemplateBuffer = fs.readFileSync(
  `${TEMPLATES_DIRECTORY}/uniqueContractGettersTemplate.hbs`,
);
const uniqueContractGettersTemplate = compile(uniqueContractGettersTemplateBuffer.toString());

export interface GenerateContractGettersInput {
  outputDirectoryPath: string;
  contractConfigs: ContractConfig[];
}

const generateGetters = ({
  outputDirectoryPath,
  contractConfigs,
}: GenerateContractGettersInput) => {
  console.log('Generating contract types...');

  contractConfigs.forEach(contractConfig => {
    const functionOutput = uniqueContractGettersTemplate({ contractName: contractConfig.name });
    const functionOutputFileName = `${contractConfig.name[0].toLowerCase()}${contractConfig.name.substring(
      1,
    )}`;

    const outputPath = `${outputDirectoryPath}/${functionOutputFileName}.ts`;

    writeFile({
      outputPath,
      content: functionOutput,
    });
  });

  console.log('Finished generating contract types');
};

export default generateGetters;
