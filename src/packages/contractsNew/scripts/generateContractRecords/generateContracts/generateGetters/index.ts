import { compile } from 'handlebars';
import { readFileSync } from 'node:fs';
import { ContractConfig } from 'packages/contractsNew/config';

import { isSwapRouterContractConfig } from 'packages/contractsNew/utilities/isSwapRouterContractConfig';
import writeFile from 'utilities/writeFile';

const TEMPLATES_DIRECTORY = `${__dirname}/templates`;

const uniqueContractGettersTemplateBuffer = readFileSync(
  `${TEMPLATES_DIRECTORY}/uniqueContractGettersTemplate.hbs`,
);
const uniqueContractGettersTemplate = compile(uniqueContractGettersTemplateBuffer.toString());

const genericContractGettersTemplateBuffer = readFileSync(
  `${TEMPLATES_DIRECTORY}/genericContractGettersTemplate.hbs`,
);
const genericContractGettersTemplate = compile(genericContractGettersTemplateBuffer.toString());

const swapRouterContractGettersTemplateBuffer = readFileSync(
  `${TEMPLATES_DIRECTORY}/swapRouterContractGettersTemplate.hbs`,
);
const swapRouterContractGettersTemplate = compile(
  swapRouterContractGettersTemplateBuffer.toString(),
);

const indexTemplateBuffer = readFileSync(`${TEMPLATES_DIRECTORY}/index.hbs`);
const indexTemplate = compile(indexTemplateBuffer.toString());

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

export const generateGetters = async ({
  outputDirectoryPath,
  contractConfigs,
}: GenerateContractGettersInput) => {
  const fileNames = contractConfigs.map(contractConfig => {
    const content = getContent({ contractConfig });
    const fileName = `${contractConfig.name[0].toLowerCase()}${contractConfig.name.substring(1)}`;
    const outputPath = `${outputDirectoryPath}/${fileName}.ts`;

    writeFile({
      outputPath,
      content,
    });

    return fileName;
  });

  // Write index file exporting all getters
  const indexOutputPath = `${outputDirectoryPath}/index.ts`;

  writeFile({
    outputPath: indexOutputPath,
    content: indexTemplate({ fileNames }),
  });
};
