import isolatedLendingTestnetDeployments from '@venusprotocol/isolated-pools/deployments/bsctestnet.json';
import config from 'config';

import mainContractAddresses from 'constants/contracts/addresses/main.json';

type IsolatedLendingContractName = keyof typeof isolatedLendingTestnetDeployments['contracts'];

const isolatedLendingContractAddresses = Object.entries(
  isolatedLendingTestnetDeployments.contracts,
).reduce(
  (accContractAddresses, [contractName, contractInfo]) => ({
    ...accContractAddresses,
    [contractName]: {
      97: contractInfo.address,
      56: '', // TODO: fill up once contracts have been deployed to mainnet
    },
  }),
  {},
) as Record<
  IsolatedLendingContractName,
  {
    [chainId: number]: string;
  }
>;

const contractAddresses = {
  ...mainContractAddresses,
  ...isolatedLendingContractAddresses,
};

const getContractAddress = (contractName: keyof typeof contractAddresses) =>
  contractAddresses[contractName][config.chainId];

export default getContractAddress;
