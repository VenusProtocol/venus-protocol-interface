import React, { Suspense, lazy, useCallback, useState } from 'react';

import { type OperationModalProps } from './Modal';

const Modal = lazy(() => import('./Modal'));

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

    return (
      <Suspense>
        <Modal {...params} onClose={() => setParams(undefined)} />
      </Suspense>
    );
  }, [params]);

  return {
    openOperationModal: (newParams: Params) => setParams(newParams),
    closeOperationModal: () => setParams(undefined),
    OperationModal,
  };
};

export default useOperationModal;
