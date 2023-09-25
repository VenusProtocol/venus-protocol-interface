import * as fs from 'fs';
import { compile } from 'handlebars';
import { ContractConfig } from 'packages/contractsNew/config';

import isSwapRouterContractConfig from 'packages/contractsNew/utilities/isSwapRouterContractConfig';
import writeFile from 'utilities/writeFile';

const TEMPLATES_DIRECTORY = `${__dirname}/templates`;

const uniqueContractGettersTemplateBuffer = fs.readFileSync(
  `${TEMPLATES_DIRECTORY}/uniqueContractGettersTemplate.hbs`,
);
const uniqueContractGettersTemplate = compile(uniqueContractGettersTemplateBuffer.toString());

const genericContractGettersTemplateBuffer = fs.readFileSync(
  `${TEMPLATES_DIRECTORY}/genericContractGettersTemplate.hbs`,
);
const genericContractGettersTemplate = compile(genericContractGettersTemplateBuffer.toString());

const swapRouterContractGettersTemplateBuffer = fs.readFileSync(
  `${TEMPLATES_DIRECTORY}/swapRouterContractGettersTemplate.hbs`,
);
const swapRouterContractGettersTemplate = compile(
  swapRouterContractGettersTemplateBuffer.toString(),
);

const getContent = ({ contractConfig }: { contractConfig: ContractConfig }) => {
  // Handle SwapRouter contract
  if (isSwapRouterContractConfig(contractConfig)) {
    return swapRouterContractGettersTemplate({
      contractName: contractConfig.name,
    });
  }

  if ('address' in contractConfig) {
    return uniqueContractGettersTemplate({
      contractName: contractConfig.name,
    });
  }

  return genericContractGettersTemplate({
    contractName: contractConfig.name,
  });
};

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
    const content = getContent({ contractConfig });
    const fileName = `${contractConfig.name[0].toLowerCase()}${contractConfig.name.substring(1)}`;
    const outputPath = `${outputDirectoryPath}/${fileName}.ts`;

    writeFile({
      outputPath,
      content,
    });
  });

  console.log('Finished generating contract types');
};

export default generateGetters;
