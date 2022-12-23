import { useContext, useMemo } from 'react';
import { VToken } from 'types';

import { useGetMainAssets } from 'clients/api';
import { AuthContext } from 'context/AuthContext';

const useGetAsset = ({ vToken }: { vToken: VToken }) => {
  const { account } = useContext(AuthContext);

  // TODO: use useGetPools hook instead
  const {
    data: { assets },
    isLoading,
  } = useGetMainAssets({
    accountAddress: account?.address,
  });

  const asset = useMemo(
    () =>
      assets.find(
        mainAsset => mainAsset.vToken.address.toLowerCase() === vToken.address.toLowerCase(),
      ),
    [vToken, assets],
  );

  return {
    isLoading,
    data: {
      asset,
    },
  };
};

export default useGetAsset;
