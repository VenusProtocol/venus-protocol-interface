import type { Provider } from '@ethersproject/abstract-provider';
import { Signer } from 'ethers';
import {
  getBep20Contract,
  getVaiContract,
  getVrtContract,
  getXvsContract,
} from 'packages/contractsNew';
import { Token } from 'types';

const getTokenContract = ({
  token,
  signerOrProvider,
}: {
  token: Token;
  signerOrProvider: Signer | Provider;
}) => {
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

export default getTokenContract;
