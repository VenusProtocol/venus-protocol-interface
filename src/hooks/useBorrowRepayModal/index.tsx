import React, { useCallback, useContext, useState } from 'react';
import { VToken } from 'types';

import { IncludeXvsContext } from 'context/IncludeXvsContext';

import Modal from './Modal';

const useBorrowRepayModal = () => {
  const { includeXvs } = useContext(IncludeXvsContext);
  const [selectedVToken, setSelectedVToken] = useState<VToken>();

  const BorrowRepayModal: React.FC = useCallback(() => {
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
    openBorrowRepayModal: (vToken: VToken) => setSelectedVToken(vToken),
    closeBorrowRepayModal: () => setSelectedVToken(undefined),
    BorrowRepayModal,
  };
};

export default useBorrowRepayModal;
