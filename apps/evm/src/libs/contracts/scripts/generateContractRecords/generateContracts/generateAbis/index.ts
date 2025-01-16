import { readFileSync } from 'node:fs';
import { compile } from 'handlebars';
import type { ContractConfig } from 'libs/contracts/config';
import writeFile from 'utilities/writeFile';

const ABI_TEMPLATE_FILE_PATH = `${__dirname}/abiTemplate.hbs`;

const abiTemplateBuffer = readFileSync(ABI_TEMPLATE_FILE_PATH);
const abiTemplate = compile(abiTemplateBuffer.toString());

export interface GenerateTypesInput {
  contractConfigs: ContractConfig[];
  outputDirectoryPath: string;
}

export const generateAbis = ({ contractConfigs, outputDirectoryPath }: GenerateTypesInput) =>
  // Go through config and extract ABIs into separate files
  contractConfigs.forEach(contractConfig => {
    const abi = JSON.stringify(contractConfig.abi);

    writeFile({
      outputPath: `${outputDirectoryPath}/${contractConfig.name}.json`,
      content: abi,
    });

    writeFile({
      outputPath: `${outputDirectoryPath}/${contractConfig.name}.ts`,
      content: abiTemplate({ abi }),
    });
  });
