import React, { useCallback, useState } from 'react';
import { VToken } from 'types';

import Modal from './Modal';

const useBorrowRepayModal = () => {
  const [selectedVToken, setSelectedVToken] = useState<VToken>();

  const BorrowRepayModal: React.FC = useCallback(() => {
    if (!selectedVToken) {
      return <></>;
    }

    return <Modal vToken={selectedVToken} onClose={() => setSelectedVToken(undefined)} />;
  }, [selectedVToken]);

  return {
    openBorrowRepayModal: (vToken: VToken) => setSelectedVToken(vToken),
    closeBorrowRepayModal: () => setSelectedVToken(undefined),
    BorrowRepayModal,
  };
};

export default useBorrowRepayModal;
