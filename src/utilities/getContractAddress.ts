import { CHAIN_ID } from 'config';
import mainContractAddresses from 'constants/contracts/addresses/main.json';

const getContractAddress = (contractId: keyof typeof mainContractAddresses) =>
  mainContractAddresses[contractId][CHAIN_ID];

export default getContractAddress;
