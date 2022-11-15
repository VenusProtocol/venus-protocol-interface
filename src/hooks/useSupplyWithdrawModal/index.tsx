import React, { useCallback, useContext, useMemo, useState } from 'react';

import { useGetUserMarketInfo } from 'clients/api';
import { AuthContext } from 'context/AuthContext';
import { IncludeXvsContext } from 'context/IncludeXvsContext';

import Modal from './Modal';

const useSupplyWithdrawModal = () => {
  const { account } = useContext(AuthContext);
  const { includeXvs } = useContext(IncludeXvsContext);
  const [selectedAssetId, setSelectedAssetId] = useState<undefined | string>();

  const {
    data: { assets },
  } = useGetUserMarketInfo({
    accountAddress: account?.address,
  });

  const selectedAsset = useMemo(
    () => assets.find(marketAsset => marketAsset.token.id === selectedAssetId),
    [selectedAssetId, JSON.stringify(assets)],
  );

  const SupplyWithdrawModal: React.FC = useCallback(() => {
    if (!selectedAsset) {
      return <></>;
    }

    return (
      <Modal
        asset={selectedAsset}
        onClose={() => setSelectedAssetId(undefined)}
        includeXvs={includeXvs}
      />
    );
  }, [selectedAsset]);

  return {
    openSupplyWithdrawModal: (assetId: string) => setSelectedAssetId(assetId),
    closeSupplyWithdrawModal: () => setSelectedAssetId(undefined),
    SupplyWithdrawModal,
  };
};

export default useSupplyWithdrawModal;
