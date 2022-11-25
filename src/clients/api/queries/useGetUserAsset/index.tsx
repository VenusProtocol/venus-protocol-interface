import { useContext, useMemo } from 'react';
import { Token } from 'types';

import { useGetUserMarketInfo } from 'clients/api';
import { AuthContext } from 'context/AuthContext';

// TODO: update to use hook to fetch a single asset
const useGetUserAsset = ({ token }: { token: Token }) => {
  const { account } = useContext(AuthContext);

  const {
    data: { assets },
    isLoading,
  } = useGetUserMarketInfo({
    accountAddress: account?.address,
  });

  const asset = useMemo(
    () =>
      assets.find(
        marketAsset => marketAsset.token.address.toLowerCase() === token.address.toLowerCase(),
      ),
    [token, assets],
  );

  return {
    isLoading,
    data: {
      asset,
    },
  };
};

export default useGetUserAsset;
