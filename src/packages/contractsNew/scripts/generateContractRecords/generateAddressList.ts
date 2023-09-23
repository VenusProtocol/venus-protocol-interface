import { ContractConfig } from 'packages/contractsNew/config';

import isSwapRouterContractConfig from 'packages/contractsNew/utilities/isSwapRouterContractConfig';
import writeFile from 'utilities/writeFile';

export interface GenerateAddressListInput {
  outputFilePath: string;
  contractConfigs: ContractConfig[];
}

const generateAddressList = ({ outputFilePath, contractConfigs }: GenerateAddressListInput) => {
  console.log('Start generating contract address list...');

  // Open addresses output
  let addressesOutput = 'export default {';

  // Go through config and extract ABIs and contract addresses
  contractConfigs.forEach(contractConfig => {
    // Add address to list
    if (!('address' in contractConfig)) {
      return;
    }

    addressesOutput += `${contractConfig.name}: {
      ${Object.entries(contractConfig.address)
        .map(([chainId, address]) => {
          if (isSwapRouterContractConfig(contractConfig)) {
            // Handle SwapRouter contract
            return `${chainId}: {${Object.entries(address)
              .map(
                ([comptrollerContractAddress, swapRouterContractAddress]) =>
                  `'${comptrollerContractAddress}': '${swapRouterContractAddress}',`,
              )
              .join('')}},`;
          }

          // Handle other contracts
          return `${chainId}: '${address}',`;
        })
        .join('')}
    },
    `;
  });

  // Close addresses output
  addressesOutput += '};';

  // Generate addresses file
  writeFile({
    outputPath: outputFilePath,
    content: addressesOutput,
  });

  console.log('Finished generating contract address list');
};

export default generateAddressList;
