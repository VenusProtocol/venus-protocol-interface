import { ContractConfig } from 'packages/contracts/config';

import writeFile from 'utilities/writeFile';

export interface GenerateTypesInput {
  contractConfigs: ContractConfig[];
  outputDirectoryPath: string;
}

export const generateAbis = ({ contractConfigs, outputDirectoryPath }: GenerateTypesInput) =>
  // Go through config and extract ABIs into separate files
  contractConfigs.forEach(contractConfig => {
    writeFile({
      outputPath: `${outputDirectoryPath}/${contractConfig.name}.json`,
      content: JSON.stringify(contractConfig.abi),
    });
  });
