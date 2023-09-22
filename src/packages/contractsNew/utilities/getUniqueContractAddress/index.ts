import { uniqueContractAddresses } from 'packages/contractsNew/generated/contractInfos/addresses';
import { ChainId } from 'types';

export type UniqueContractName = keyof typeof uniqueContractAddresses;

export type GetUniqueContractAddressInput = {
  name: UniqueContractName;
  chainId: ChainId;
};

// TODO: see if we can make this function more generic (getContractAddress) so that it can also
// retrieve the address of a SwapRouter contract
const getUniqueContractAddress = ({ name, chainId }: GetUniqueContractAddressInput) =>
  uniqueContractAddresses[name][chainId];

export default getUniqueContractAddress;
