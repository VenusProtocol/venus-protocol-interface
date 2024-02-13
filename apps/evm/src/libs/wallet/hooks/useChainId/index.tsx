import { getChainIdFromSearchParams } from 'libs/wallet/utilities/getChainIdFromSearchParams';
import { useSearchParams } from 'react-router-dom';

export const useChainId = () => {
  const [searchParams] = useSearchParams();
  return getChainIdFromSearchParams({ searchParams });
};
