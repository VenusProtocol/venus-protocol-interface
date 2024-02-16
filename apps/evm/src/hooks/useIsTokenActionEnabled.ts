import { isTokenActionEnabled } from '@venusprotocol/web3';
import { useMemo } from 'react';

import { useChainId } from 'libs/wallet';
import { TokenAction } from 'types';

export interface UseIsTokenActionEnabledInput {
  tokenAddress: string;
  action: TokenAction;
}

const useIsTokenActionEnabled = ({ tokenAddress, action }: UseIsTokenActionEnabledInput) => {
  const { chainId } = useChainId();

  return useMemo(
    () =>
      isTokenActionEnabled({
        tokenAddress,
        chainId,
        action,
      }),
    [chainId, tokenAddress, action],
  );
};

export default useIsTokenActionEnabled;
