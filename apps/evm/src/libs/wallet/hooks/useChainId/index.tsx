import { useSearchParams } from 'react-router-dom';

import { getChainId } from 'libs/wallet/utilities/getChainId';

export const useChainId = () => {
  const [searchParams] = useSearchParams();
  return getChainId({ searchParams });
};
