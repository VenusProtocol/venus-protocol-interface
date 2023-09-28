import { ContractConfig } from 'packages/contractsNew/config';

import writeFile from 'utilities/writeFile';

export interface GenerateTypesInput {
  contractConfigs: ContractConfig[];
  outputDirectoryPath: string;
}

export const generateAbis = async ({ contractConfigs, outputDirectoryPath }: GenerateTypesInput) =>
  // Go through config and extract ABIs into separate files
  Promise.all(
    contractConfigs.map(contractConfig =>
      writeFile({
        outputPath: `${outputDirectoryPath}/${contractConfig.name}.json`,
        content: JSON.stringify(contractConfig.abi),
      }),
    ),
  );
