import { ContractConfig } from 'packages/contractsNew/config';

<<<<<<< HEAD
import isSwapRouterContractConfig from 'packages/contractsNew/utilities/isSwapRouterContractConfig';
import writeFile from 'utilities/writeFile';
=======
import { isSwapRouterContractConfig } from 'packages/contractsNew/utilities/isSwapRouterContractConfig';
import { writeFile } from 'utilities/writeFile';
>>>>>>> b68ae6703 (refactor: remove default exports from package)

export interface GenerateAddressListInput {
  outputFilePath: string;
  contractConfigs: ContractConfig[];
}

export const generateAddressList = async ({
  outputFilePath,
  contractConfigs,
}: GenerateAddressListInput) => {
  // Open addresses output
  let addressesOutput = 'export default {';

  // Go through config and extract contract addresses
  contractConfigs.forEach(contractConfig => {
    // Ignore generic contracts
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
};
