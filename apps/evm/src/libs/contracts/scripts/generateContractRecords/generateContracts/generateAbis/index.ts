import { readFileSync } from 'node:fs';
import { compile } from 'handlebars';
import type { ContractConfig } from 'libs/contracts/config';
import writeFile from 'utilities/writeFile';
import './handleBarsHelpers';

const TEMPLATES_DIRECTORY = `${__dirname}/templates`;

const abiTemplateBuffer = readFileSync(`${TEMPLATES_DIRECTORY}/abiTemplate.hbs`);
const abiTemplate = compile(abiTemplateBuffer.toString());

const indexTemplateBuffer = readFileSync(`${TEMPLATES_DIRECTORY}/index.hbs`);
const indexTemplate = compile(indexTemplateBuffer.toString());

export interface GenerateTypesInput {
  contractConfigs: ContractConfig[];
  outputDirectoryPath: string;
}

export const generateAbis = ({ contractConfigs, outputDirectoryPath }: GenerateTypesInput) => {
  // Go through config and extract ABIs into separate files
  const contractNames = contractConfigs.map(contractConfig => {
    const abi = JSON.stringify(contractConfig.abi);

    writeFile({
      outputPath: `${outputDirectoryPath}/${contractConfig.name}.json`,
      content: abi,
    });

    writeFile({
      outputPath: `${outputDirectoryPath}/${contractConfig.name}.ts`,
      content: abiTemplate({ abi }),
    });

    return contractConfig.name;
  });

  // Write index file exporting all ABIs
  const indexOutputPath = `${outputDirectoryPath}/index.ts`;

  writeFile({
    outputPath: indexOutputPath,
    content: indexTemplate({ contractNames }),
  });
};
