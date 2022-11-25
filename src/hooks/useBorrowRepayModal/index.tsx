import React, { useCallback, useContext, useState } from 'react';
import { Token } from 'types';

import { IncludeXvsContext } from 'context/IncludeXvsContext';

import Modal from './Modal';

const useBorrowRepayModal = () => {
  const { includeXvs } = useContext(IncludeXvsContext);
  const [selectedToken, setSelectedToken] = useState<undefined | { token: Token; vToken: Token }>();

  const BorrowRepayModal: React.FC = useCallback(() => {
    if (!selectedToken) {
      return <></>;
    }

    return (
      <Modal
        {...selectedToken}
        onClose={() => setSelectedToken(undefined)}
        includeXvs={includeXvs}
      />
    );
  }, [selectedToken]);

  return {
    openBorrowRepayModal: ({ token, vToken }: { token: Token; vToken: Token }) =>
      setSelectedToken({ token, vToken }),
    closeBorrowRepayModal: () => setSelectedToken(undefined),
    BorrowRepayModal,
  };
};

export default useBorrowRepayModal;
