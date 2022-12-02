import React, { useCallback, useContext, useState } from 'react';
import { VToken } from 'types';

import { IncludeXvsContext } from 'context/IncludeXvsContext';

import Modal from './Modal';

const useSupplyWithdrawModal = () => {
  const { includeXvs } = useContext(IncludeXvsContext);
  const [selectedVToken, setSelectedVToken] = useState<VToken>();

  const SupplyWithdrawModal: React.FC = useCallback(() => {
    if (!selectedVToken) {
      return <></>;
    }

    return (
      <Modal
        vToken={selectedVToken}
        onClose={() => setSelectedVToken(undefined)}
        includeXvs={includeXvs}
      />
    );
  }, [selectedVToken]);

  return {
    openSupplyWithdrawModal: (vToken: VToken) => setSelectedVToken(vToken),
    closeSupplyWithdrawModal: () => setSelectedVToken(undefined),
    SupplyWithdrawModal,
  };
};

export default useSupplyWithdrawModal;
