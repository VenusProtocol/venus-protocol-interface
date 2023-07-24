import { ContractName } from '../types/contractName';

import * as contractInfos from '../contractInfos';

interface Variables {
  chainId: number;
}

export default function getContractAddress<TContractName extends ContractName>(
  name: TContractName,
  variables: Variables,
) {
  return contractInfos[name].address?.[variables.chainId];
}
