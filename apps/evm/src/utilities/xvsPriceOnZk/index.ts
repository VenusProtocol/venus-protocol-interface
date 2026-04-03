import { ChainId, type Token } from 'types';
import areTokensEqual from 'utilities/areTokensEqual';

interface CheckIsXvsOnZkInput {
  chainId: ChainId;
  token: Token | undefined;
  xvs: Token | undefined;
}

export const checkIsXvsOnZk = ({ chainId, token, xvs }: CheckIsXvsOnZkInput) => {
  const isXvsOnZk = Boolean(
    [ChainId.ZKSYNC_MAINNET, ChainId.ZKSYNC_SEPOLIA].includes(chainId) &&
      xvs &&
      token &&
      areTokensEqual(token, xvs),
  );

  return isXvsOnZk;
};
