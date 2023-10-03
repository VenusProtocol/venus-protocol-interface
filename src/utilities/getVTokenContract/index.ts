import type { Provider } from '@ethersproject/abstract-provider';
import { Signer } from 'ethers';
import { getVBnbContract, getVTokenContract as getVTokenContractFn } from 'packages/contracts';
import { VToken } from 'types';

const getVTokenContract = ({
  vToken,
  signerOrProvider,
}: {
  vToken: VToken;
  signerOrProvider: Signer | Provider;
}) => {
  const input = {
    address: vToken.address,
    signerOrProvider,
  };

  if (vToken.symbol === 'vBNB') {
    return getVBnbContract(input);
  }

  return getVTokenContractFn(input);
};

export default getVTokenContract;
