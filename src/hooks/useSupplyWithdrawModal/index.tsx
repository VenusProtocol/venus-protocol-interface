import React, { useCallback, useContext, useState } from 'react';
import { Asset } from 'types';

import { IncludeXvsContext } from 'context/IncludeXvsContext';

import Modal from './Modal';

const useSupplyWithdrawModal = () => {
  const { includeXvs } = useContext(IncludeXvsContext);
  const [selectedAssetId, setSelectedAssetId] = useState<undefined | Asset['id']>();

  const SupplyWithdrawModal: React.FC = useCallback(() => {
    if (!selectedAssetId) {
      return <></>;
    }

    return (
      <Modal
        assetId={selectedAssetId}
        onClose={() => setSelectedAssetId(undefined)}
        includeXvs={includeXvs}
      />
    );
  }, [selectedAssetId]);

  return {
    openSupplyWithdrawModal: (assetId: Asset['id']) => setSelectedAssetId(assetId),
    closeSupplyWithdrawModal: () => setSelectedAssetId(undefined),
    SupplyWithdrawModal,
  };
};

export default useSupplyWithdrawModal;
