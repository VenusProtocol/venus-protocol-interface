import isolatedLendingTestnetDeployments from '@venusprotocol/isolated-pools/deployments/bsctestnet.json';
import config from 'config';

import mainContractAddresses from 'constants/contracts/addresses/main.json';

const getContractAddress = (contractId: keyof typeof mainContractAddresses) =>
  mainContractAddresses[contractId][config.chainId];

export const getIsolatedPoolAddress = (
  contractName: keyof typeof isolatedLendingTestnetDeployments.contracts,
) => (config.isOnTestnet ? isolatedLendingTestnetDeployments.contracts[contractName].address : '');

export default getContractAddress;
