import { ContractName } from '../types/contractName';
import { ChainId } from '../types/general';

import * as contractInfos from '../contractInfos';

interface Variables {
  chainId: ChainId;
}

export default function getContractAddress<TContractName extends ContractName>(
  name: TContractName,
  variables: Variables,
) {
  const contractInfo = contractInfos[name];

  if ('address' in contractInfo) {
    return contractInfo.address[variables.chainId];
  }

  return undefined;
}
