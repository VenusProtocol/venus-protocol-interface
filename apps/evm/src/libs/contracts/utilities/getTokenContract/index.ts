import type { Provider } from '@ethersproject/abstract-provider';
import type { Signer } from 'ethers';

import {
  getErc20Contract,
  getVaiContract,
  getVrtContract,
  getXvsContract,
} from 'libs/contracts/generated/getters';
import type { Token } from 'types';

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

  return getErc20Contract(input);
};
