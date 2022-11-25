import React, { useCallback, useContext, useState } from 'react';
import { Token } from 'types';

import { IncludeXvsContext } from 'context/IncludeXvsContext';

import Modal from './Modal';

const useSupplyWithdrawModal = () => {
  const { includeXvs } = useContext(IncludeXvsContext);
  const [selectedToken, setSelectedToken] = useState<undefined | { token: Token; vToken: Token }>();

  const SupplyWithdrawModal: React.FC = useCallback(() => {
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
    openSupplyWithdrawModal: ({ token, vToken }: { token: Token; vToken: Token }) =>
      setSelectedToken({ token, vToken }),
    closeSupplyWithdrawModal: () => setSelectedToken(undefined),
    SupplyWithdrawModal,
  };
};

export default useSupplyWithdrawModal;
