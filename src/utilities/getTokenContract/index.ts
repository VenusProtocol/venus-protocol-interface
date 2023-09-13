import type { Provider } from '@ethersproject/abstract-provider';
import { Signer } from 'ethers';
import { getGenericContract } from 'packages/contracts';
import { Token, VenusTokenSymbol } from 'types';

const getTokenContract = ({
  token,
  signerOrProvider,
}: {
  token: Token;
  signerOrProvider: Signer | Provider;
}) => {
  let name: 'bep20' | 'xvs' | 'vai' | 'vrt' = 'bep20';

  if (token.symbol === VenusTokenSymbol.XVS) {
    name = 'xvs';
  } else if (token.symbol === VenusTokenSymbol.VAI) {
    name = 'vai';
  } else if (token.symbol === VenusTokenSymbol.VRT) {
    name = 'vrt';
  }

  return getGenericContract({
    name,
    address: token.address,
    signerOrProvider,
  });
};

export default getTokenContract;
