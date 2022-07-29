import noop from 'noop-ts';
import React from 'react';

import {
  SuccessfulTransactionModal,
  SuccessfulTransactionModalProps,
} from 'components/SuccessfulTransactionModal';

export type OpenSuccessfulTransactionModalInput = Pick<
  SuccessfulTransactionModalProps,
  'title' | 'content' | 'transactionHash' | 'amount'
>;

export interface SuccessfulTransactionModalContextValue {
  openSuccessfulTransactionModal: (params: OpenSuccessfulTransactionModalInput) => void;
  closeSuccessfulTransactionModal: () => void;
}

export const SuccessfulTransactionModalContext =
  React.createContext<SuccessfulTransactionModalContextValue>({
    openSuccessfulTransactionModal: noop,
    closeSuccessfulTransactionModal: noop,
  });

export const SuccessfulTransactionModalProvider: React.FC = ({ children }) => {
  const [isOpen, setIsOpened] = React.useState(false);
  const [modalProps, setModalProps] = React.useState<
    OpenSuccessfulTransactionModalInput | undefined
  >();

  const openSuccessfulTransactionModal = (params: OpenSuccessfulTransactionModalInput) => {
    setModalProps(params);
    setIsOpened(true);
  };

  const closeSuccessfulTransactionModal = () => {
    setIsOpened(false);

    // Wait for fade out animation to finish before resetting modal props
    setTimeout(() => {
      // Don't reset modal props if modal has been reopened since (can happen if
      // openSuccessfulTransactionModal is called within less than 500ms after
      // closeSuccessfulTransactionModal was called)
      if (!isOpen) {
        setModalProps(undefined);
      }
    }, 500);
  };

  return (
    <SuccessfulTransactionModalContext.Provider
      value={{
        openSuccessfulTransactionModal,
        closeSuccessfulTransactionModal,
      }}
    >
      {modalProps && (
        <SuccessfulTransactionModal
          isOpen={isOpen}
          handleClose={closeSuccessfulTransactionModal}
          {...modalProps}
        />
      )}

      {children}
    </SuccessfulTransactionModalContext.Provider>
  );
};
