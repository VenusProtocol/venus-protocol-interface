import isolatedLendingMainnetDeployments from '@venusprotocol/isolated-pools/deployments/bscmainnet.json';
import isolatedLendingTestnetDeployments from '@venusprotocol/isolated-pools/deployments/bsctestnet.json';
import config from 'config';

import mainContractChainAddresses from 'constants/contracts/addresses/main.json';

const mainContractAddresses = Object.entries(mainContractChainAddresses).reduce(
  (accContractAddresses, [contractName, addresses]) => ({
    ...accContractAddresses,
    [contractName]: addresses[config.chainId],
  }),
  {} as Record<keyof typeof mainContractChainAddresses, string>,
);

const isolatedLendingContractChainAddresses = config.isOnTestnet
  ? isolatedLendingTestnetDeployments.contracts
  : isolatedLendingMainnetDeployments.contracts;

type IsolatedLendingContractName = keyof typeof isolatedLendingContractChainAddresses;

const isolatedLendingContractAddresses = Object.entries(
  isolatedLendingContractChainAddresses,
).reduce(
  (accContractAddresses, [contractName, contractInfo]) => ({
    ...accContractAddresses,
    [contractName]: contractInfo.address,
  }),
  {},
) as Record<IsolatedLendingContractName, string>;

const contractAddresses = {
  ...mainContractAddresses,
  ...isolatedLendingContractAddresses,
};

/**
 * @deprecated Use methods from contracts package instead
 */
const getContractAddress = (contractName: keyof typeof contractAddresses) =>
  contractAddresses[contractName];

export default getContractAddress;
