import config from 'config';
import { useMemo } from 'react';
import { VToken } from 'types';
import { getVTokenContract } from 'utilities';

import { useAuth } from 'context/AuthContext';

const useGetVTokenContract = (vToken: VToken) => {
  const { signer, provider } = useAuth();
  const signerOrProvider = signer || provider;
  // TODO: get from auth context. Right now the config defines the chain ID and so the dApp only
  // needs to support one chain, but since our goal is to become multichain then the chain ID needs
  // to be considered dynamic.
  const { chainId } = config;

  return useMemo(
    () =>
      chainId !== undefined // Although chainId isn't used, we don't want to fetch any data unless it exists
        ? getVTokenContract({ vToken, signerOrProvider })
        : undefined,
    [signerOrProvider, chainId, vToken],
  );
};

export default useGetVTokenContract;
