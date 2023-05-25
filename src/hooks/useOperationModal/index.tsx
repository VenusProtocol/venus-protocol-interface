import React, { useCallback, useState } from 'react';
import { VToken } from 'types';

import Modal from './Modal';

interface Params {
  vToken: VToken;
  poolComptrollerAddress: string;
}

const useOperationModal = () => {
  const [params, setParams] = useState<Params>();

  const OperationModal: React.FC = useCallback(() => {
    if (!params) {
      return <></>;
    }

    return <Modal {...params} onClose={() => setParams(undefined)} />;
  }, [params]);

  return {
    openOperationModal: (
      newParams: Params,
      // TODO: add initial tab param
    ) => setParams(newParams),
    closeOperationModal: () => setParams(undefined),
    OperationModal,
  };
};

export default useOperationModal;
