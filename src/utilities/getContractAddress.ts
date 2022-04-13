import { CHAIN_ID } from 'config';
import addresses from 'constants/contractAddresses.json';

const getContractAddress = (contractId: keyof typeof addresses) => addresses[contractId][CHAIN_ID];

export default getContractAddress;
