import { useSearchParams } from 'react-router-dom';

import { getChainIdFromSearchParams } from 'libs/wallet/utilities/getChainIdFromSearchParams';

export const useChainId = () => {
  const [searchParams] = useSearchParams();
  return getChainIdFromSearchParams({ searchParams });
};
