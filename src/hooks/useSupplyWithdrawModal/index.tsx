import React, { useCallback, useState } from 'react';
import { VToken } from 'types';

import Modal from './Modal';

const useSupplyWithdrawModal = () => {
  const [selectedVToken, setSelectedVToken] = useState<VToken>();

  const SupplyWithdrawModal: React.FC = useCallback(() => {
    if (!selectedVToken) {
      return <></>;
    }

    return <Modal vToken={selectedVToken} onClose={() => setSelectedVToken(undefined)} />;
  }, [selectedVToken]);

  return {
    openSupplyWithdrawModal: (vToken: VToken) => setSelectedVToken(vToken),
    closeSupplyWithdrawModal: () => setSelectedVToken(undefined),
    SupplyWithdrawModal,
  };
};

export default useSupplyWithdrawModal;
