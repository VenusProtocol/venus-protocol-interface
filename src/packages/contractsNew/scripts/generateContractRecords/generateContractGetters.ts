import * as fs from 'fs';
import { compile } from 'handlebars';
import { ContractConfig } from 'packages/contractsNew/config';

import getAbsolutePath from 'packages/contractsNew/utilities/getAbsolutePath';
import writeFile from 'utilities/writeFile';

const TEMPLATES_DIRECTORY = getAbsolutePath({
  relativePath: 'scripts/generateContractRecords/templates',
});

const uniqueContractGettersTemplateBuffer = fs.readFileSync(
  `${TEMPLATES_DIRECTORY}/uniqueContractGettersTemplate.hbs`,
);
const uniqueContractGettersTemplate = compile(uniqueContractGettersTemplateBuffer.toString());

export interface GenerateContractGettersInput {
  directoryPath: string;
  contractConfig: ContractConfig;
}

const generateContractGetters = ({
  directoryPath,
  contractConfig,
}: GenerateContractGettersInput) => {
  const functionOutput = uniqueContractGettersTemplate({ contractName: contractConfig.name });
  const functionOutputFileName = `${contractConfig.name[0].toLowerCase()}${contractConfig.name.substring(
    1,
  )}`;

  const outputPath = `${directoryPath}/${functionOutputFileName}.ts`;

  writeFile({
    outputPath,
    content: functionOutput,
  });
};

export default generateContractGetters;
