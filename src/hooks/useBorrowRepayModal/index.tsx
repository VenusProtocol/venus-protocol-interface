import React, { useCallback, useContext, useState } from 'react';
import { Asset } from 'types';

import { IncludeXvsContext } from 'context/IncludeXvsContext';

import Modal from './Modal';

const useBorrowRepayModal = () => {
  const { includeXvs } = useContext(IncludeXvsContext);
  const [selectedAssetId, setSelectedAssetId] = useState<undefined | Asset['id']>();

  const BorrowRepayModal: React.FC = useCallback(() => {
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
    openBorrowRepayModal: (assetId: Asset['id']) => setSelectedAssetId(assetId),
    closeBorrowRepayModal: () => setSelectedAssetId(undefined),
    BorrowRepayModal,
  };
};

export default useBorrowRepayModal;
