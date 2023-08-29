import { ChainId } from 'packages/contracts';
import { useMemo } from 'react';

import getProvider from './getProvider';

export interface UseProviderInput {
  chainId?: ChainId;
}

const useProvider = ({ chainId }: UseProviderInput) =>
  useMemo(() => getProvider({ chainId }), [chainId]);

export default useProvider;
