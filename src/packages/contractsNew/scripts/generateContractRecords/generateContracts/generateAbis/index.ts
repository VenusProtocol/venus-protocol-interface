import { ContractConfig } from 'packages/contractsNew/config';

import writeFile from 'utilities/writeFile';

export interface GenerateTypesInput {
  contractConfigs: ContractConfig[];
  outputDirectoryPath: string;
}

const generateAbis = ({ contractConfigs, outputDirectoryPath }: GenerateTypesInput) => {
  console.log('Generating contract ABIs...');

  // Go through config and extract ABIs into separate files
  contractConfigs.forEach(contractConfig => {
    writeFile({
      outputPath: `${outputDirectoryPath}/${contractConfig.name}.json`,
      content: JSON.stringify(contractConfig.abi),
    });
  });

  console.log('Finished generating contract ABIs...');
};

export default generateAbis;
