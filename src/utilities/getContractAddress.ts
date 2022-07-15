import config from 'config';

import mainContractAddresses from 'constants/contracts/addresses/main.json';

const getContractAddress = (contractId: keyof typeof mainContractAddresses) =>
  mainContractAddresses[contractId][config.chainId];

export default getContractAddress;
