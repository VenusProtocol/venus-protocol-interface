import addresses from 'packages/contractsNew/generated/infos/addresses';
import { UniqueContractName } from 'packages/contractsNew/generated/infos/types';
import { ChainId } from 'types';

export type GetUniqueContractAddressInput = {
  name: UniqueContractName;
  chainId: ChainId;
};

export const getUniqueContractAddress = ({ name, chainId }: GetUniqueContractAddressInput) =>
  addresses[name][chainId];
