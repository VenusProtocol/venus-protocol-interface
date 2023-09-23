import addresses from 'packages/contractsNew/infos/addresses';
import { UniqueContractName } from 'packages/contractsNew/infos/types';
import { ChainId } from 'types';

export type GetUniqueContractAddressInput = {
  name: UniqueContractName;
  chainId: ChainId;
};

const getUniqueContractAddress = ({ name, chainId }: GetUniqueContractAddressInput) =>
  addresses[name][chainId];

export default getUniqueContractAddress;
