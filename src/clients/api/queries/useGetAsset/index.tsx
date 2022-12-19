import { useContext, useMemo } from 'react';
import { VToken } from 'types';

import { useGetMainAssets } from 'clients/api';
import { AuthContext } from 'context/AuthContext';

const useGetAsset = ({ vToken }: { vToken: VToken }) => {
  const { account } = useContext(AuthContext);

  const {
    data: { assets },
    isLoading,
  } = useGetMainAssets({
    accountAddress: account?.address,
  });

  // TODO: add support for isolated assets

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
