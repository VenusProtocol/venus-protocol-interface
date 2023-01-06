import React, { useCallback, useState } from 'react';
import { VToken } from 'types';

import Modal from './Modal';

interface Params {
  vToken: VToken;
  poolComptrollerAddress: string;
}

const useSupplyWithdrawModal = () => {
  const [params, setParams] = useState<Params>();

  const SupplyWithdrawModal: React.FC = useCallback(() => {
    if (!params) {
      return <></>;
    }

    return <Modal {...params} onClose={() => setParams(undefined)} />;
  }, [params]);

  return {
    openSupplyWithdrawModal: (newParams: Params) => setParams(newParams),
    closeSupplyWithdrawModal: () => setParams(undefined),
    SupplyWithdrawModal,
  };
};

export default useSupplyWithdrawModal;
