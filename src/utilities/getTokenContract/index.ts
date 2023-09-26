import type { Provider } from '@ethersproject/abstract-provider';
import { Signer } from 'ethers';
import { getGenericContract } from 'packages/contracts';
import { Token } from 'types';

export const getTokenContract = ({
  token,
  signerOrProvider,
}: {
  token: Token;
  signerOrProvider: Signer | Provider;
}) => {
  let name: 'bep20' | 'xvs' | 'vai' | 'vrt' = 'bep20';

  if (token.symbol === 'XVS') {
    name = 'xvs';
  } else if (token.symbol === 'VAI') {
    name = 'vai';
  } else if (token.symbol === 'VRT') {
    name = 'vrt';
  }

  return getGenericContract({
    name,
    address: token.address,
    signerOrProvider,
  });
};
