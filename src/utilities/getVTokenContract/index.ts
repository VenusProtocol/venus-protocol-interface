import type { Provider } from '@ethersproject/abstract-provider';
import { Signer } from 'ethers';
import { getGenericContract } from 'packages/contracts';
import { VToken } from 'types';

export const getVTokenContract = ({
  vToken,
  signerOrProvider,
}: {
  vToken: VToken;
  signerOrProvider: Signer | Provider;
}) => {
  let name: 'vToken' | 'vBnb' = 'vToken';

  if (vToken.symbol === 'vBNB') {
    name = 'vBnb';
  }

  return getGenericContract({
    name,
    address: vToken.address,
    signerOrProvider,
  });
};
