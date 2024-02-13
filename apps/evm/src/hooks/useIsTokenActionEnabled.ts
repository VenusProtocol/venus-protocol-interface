import { isTokenActionEnabled } from 'libs/tokens';
import { useChainId } from 'libs/wallet';
import { useMemo } from 'react';

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
