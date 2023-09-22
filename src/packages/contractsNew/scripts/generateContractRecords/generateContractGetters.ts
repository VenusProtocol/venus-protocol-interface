import { ContractConfig } from 'packages/contractsNew/config';

import writeFile from 'utilities/writeFile';

export interface GenerateContractGettersInput {
  directoryPath: string;
  contractConfig: ContractConfig;
}

const generateContractGetters = ({
  directoryPath,
  contractConfig,
}: GenerateContractGettersInput) => {
  const functionOutput = `
    import abi from 'packages/contractsNew/infos/abis/${contractConfig.name}.json';
    import { ${contractConfig.name} } from 'packages/contractsNew/infos/types';

    import uniqueContractGetterGenerator from 'packages/contractsNew/utilities/uniqueContractGetterGenerator';
    import uniqueContractGetterHookGenerator from 'packages/contractsNew/utilities/uniqueContractGetterHookGenerator';

    export const get${contractConfig.name}Contract = uniqueContractGetterGenerator<${contractConfig.name}>({
      name: '${contractConfig.name}',
      abi,
    });

    export const useGet${contractConfig.name}Contract = uniqueContractGetterHookGenerator({
      getter: get${contractConfig.name}Contract,
    });
  `;

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
