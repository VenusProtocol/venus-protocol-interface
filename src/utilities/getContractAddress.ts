import { CHAIN_ID } from 'config';
import mainContractAddresses from 'constants/contracts/addresses/main.json';
import tokenContractAddresses from 'constants/contracts/addresses/tokens.json';

const contractAddresses = { ...mainContractAddresses, ...tokenContractAddresses };

const getContractAddress = (contractId: keyof typeof contractAddresses) =>
  contractAddresses[contractId][CHAIN_ID];

export default getContractAddress;
