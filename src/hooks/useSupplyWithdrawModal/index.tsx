import React, { useCallback, useState } from 'react';
import { Asset } from 'types';

import Modal from './Modal';

const useSupplyWithdrawModal = ({
  // TODO: get from context
  isXvsEnabled,
}: {
  isXvsEnabled: boolean;
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState<undefined | Asset['id']>();

  const SupplyWithdrawModal: React.FC = useCallback(() => {
    if (!selectedAssetId) {
      return <></>;
    }

    return (
      <Modal
        assetId={selectedAssetId}
        onClose={() => setSelectedAssetId(undefined)}
        isXvsEnabled={isXvsEnabled}
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
