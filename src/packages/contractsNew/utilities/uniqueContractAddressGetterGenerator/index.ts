import { UniqueContractName } from 'packages/contractsNew/generated/infos/types';
import { ChainId } from 'types';

import { getUniqueContractAddress } from 'packages/contractsNew/utilities/getUniqueContractAddress';

export interface UniqueContractAddressGetterGeneratorInput {
  name: UniqueContractName;
}

export interface UniqueContractAddressGetterInput {
  chainId: ChainId;
}

export type UniqueContractAddressGetter = (
  input: UniqueContractAddressGetterInput,
) => string | undefined;

export const uniqueContractAddressGetterGenerator = ({
  name,
}: UniqueContractAddressGetterGeneratorInput) => {
  const getter: UniqueContractAddressGetter = ({ chainId }) =>
    getUniqueContractAddress({ name, chainId });

  return getter;
};
