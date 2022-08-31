import React, { useState } from 'react';
import { Asset } from 'types';

import Modal from './Modal';

const useSupplyWithdrawModal = ({
  // TODO: get from context
  isXvsEnabled,
}: {
  isXvsEnabled: boolean;
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState<undefined | Asset['id']>();

  return {
    openSupplyWithdrawModal: (assetId: Asset['id']) => setSelectedAssetId(assetId),
    closeSupplyWithdrawModal: () => setSelectedAssetId(undefined),
    supplyWithdrawModalDom: selectedAssetId ? (
      <Modal
        assetId={selectedAssetId}
        onClose={() => setSelectedAssetId(undefined)}
        isXvsEnabled={isXvsEnabled}
      />
    ) : null,
  };
};

export default useSupplyWithdrawModal;
