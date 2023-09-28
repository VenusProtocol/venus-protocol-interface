import { ChainId } from 'types';

import addresses from '../generated/infos/addresses';
import { UniqueContractName } from '../generated/infos/types';

export type GetUniqueContractAddressInput = {
  name: UniqueContractName;
  chainId: ChainId;
};

export const getUniqueContractAddress = ({ name, chainId }: GetUniqueContractAddressInput) =>
  addresses[name][chainId];
