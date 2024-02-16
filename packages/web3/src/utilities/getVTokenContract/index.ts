import type { Provider } from '@ethersproject/abstract-provider';
import { Signer } from 'ethers';
import { getVBep20Contract, getVBnbContract } from 'generated/contracts';

import { VToken } from 'types';

export interface GetVTokenContractInput {
  vToken: VToken;
  signerOrProvider: Signer | Provider;
}

export const getVTokenContract = ({ vToken, signerOrProvider }: GetVTokenContractInput) => {
  const input = {
    address: vToken.address,
    signerOrProvider,
  };

  if (vToken.symbol === 'vBNB') {
    return getVBnbContract(input);
  }

  return getVBep20Contract(input);
};
