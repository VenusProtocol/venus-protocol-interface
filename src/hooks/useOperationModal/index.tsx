import React, { useCallback, useState } from 'react';

import Modal, { OperationModalProps } from './Modal';

interface Params {
  vToken: OperationModalProps['vToken'];
  poolComptrollerAddress: OperationModalProps['poolComptrollerAddress'];
  initialActiveTabIndex?: OperationModalProps['initialActiveTabIndex'];
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
    openOperationModal: (newParams: Params) => setParams(newParams),
    closeOperationModal: () => setParams(undefined),
    OperationModal,
  };
};

export default useOperationModal;
