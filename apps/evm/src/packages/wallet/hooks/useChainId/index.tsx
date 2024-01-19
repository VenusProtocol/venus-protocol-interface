import { useSearchParams } from 'react-router-dom';

import { getChainIdFromSearchParams } from 'packages/wallet/utilities/getChainIdFromSearchParams';

export const useChainId = () => {
  const [searchParams] = useSearchParams();
  return getChainIdFromSearchParams({ searchParams });
};
