import React, { useCallback, useState } from 'react';
import { VToken } from 'types';

import Modal from './Modal';

interface Params {
  vToken: VToken;
  poolComptrollerAddress: string;
}

const useBorrowRepayModal = () => {
  const [params, setParams] = useState<Params>();

  const BorrowRepayModal: React.FC = useCallback(() => {
    if (!params) {
      return <></>;
    }

    return <Modal {...params} onClose={() => setParams(undefined)} />;
  }, [params]);

  return {
    openBorrowRepayModal: (newParams: Params) => setParams(newParams),
    closeBorrowRepayModal: () => setParams(undefined),
    BorrowRepayModal,
  };
};

export default useBorrowRepayModal;
