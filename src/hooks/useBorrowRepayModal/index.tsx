import React, { useState } from 'react';
import { Asset } from 'types';

import Modal from './Modal';

const useBorrowRepayModal = ({
  // TODO: get from context
  isXvsEnabled,
}: {
  isXvsEnabled: boolean;
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState<undefined | Asset['id']>();

  return {
    openBorrowRepayModal: (assetId: Asset['id']) => setSelectedAssetId(assetId),
    closeBorrowRepayModal: () => setSelectedAssetId(undefined),
    borrowRepayModalDom: selectedAssetId ? (
      <Modal
        assetId={selectedAssetId}
        onClose={() => setSelectedAssetId(undefined)}
        isXvsEnabled={isXvsEnabled}
      />
    ) : null,
  };
};

export default useBorrowRepayModal;
