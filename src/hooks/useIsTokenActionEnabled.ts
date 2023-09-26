import { isTokenActionEnabled } from 'packages/tokens';
import { useMemo } from 'react';
import { TokenAction } from 'types';

import { useAuth } from 'context/AuthContext';

export interface UseIsTokenActionEnabledInput {
  tokenAddress: string;
  action: TokenAction;
}

const useIsTokenActionEnabled = ({ tokenAddress, action }: UseIsTokenActionEnabledInput) => {
  const { chainId } = useAuth();

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
