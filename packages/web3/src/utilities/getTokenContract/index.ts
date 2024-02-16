import type { Provider } from '@ethersproject/abstract-provider';
import { Signer } from 'ethers';
import {
  getBep20Contract,
  getVaiContract,
  getVrtContract,
  getXvsContract,
} from 'generated/contracts';

import { Token } from 'types';

export interface GetTokenContractInput {
  token: Token;
  signerOrProvider: Signer | Provider;
}

export const getTokenContract = ({ token, signerOrProvider }: GetTokenContractInput) => {
  const input = {
    address: token.address,
    signerOrProvider,
  };

  if (token.symbol === 'XVS') {
    return getXvsContract(input);
  }

  if (token.symbol === 'VAI') {
    return getVaiContract(input);
  }

  if (token.symbol === 'VRT') {
    return getVrtContract(input);
  }

  return getBep20Contract(input);
};
