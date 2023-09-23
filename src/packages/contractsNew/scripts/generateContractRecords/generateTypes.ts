import { ContractConfig } from 'packages/contractsNew/config';
import { glob, runTypeChain } from 'typechain';

export interface GenerateTypesInput {
  abiDirectoryPath: string;
  outputDirectoryPath: string;
}

const generateTypes = async ({ outputDirectoryPath, abiDirectoryPath }: GenerateTypesInput) => {
  console.log('Generating contract types...');

  const cwd = process.cwd();
  const abiFiles = glob(cwd, [`${abiDirectoryPath}/**/+([a-zA-Z0-9_]).json`]);

  await runTypeChain({
    cwd,
    filesToProcess: abiFiles,
    allFiles: abiFiles,
    outDir: outputDirectoryPath,
    target: 'ethers-v5',
  });

  console.log('Finished generating contract types');
};

export default generateTypes;
