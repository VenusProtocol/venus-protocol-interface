import React from 'react';
import noop from 'noop-ts';

import {
  SuccessfulTransactionModal,
  ISuccessfulTransactionModalProps,
} from 'components/v2/SuccessfulTransactionModal';

type OpenSuccessfulTransactionModalInput = Pick<
  ISuccessfulTransactionModalProps,
  'title' | 'message' | 'transactionHash' | 'amount'
>;

export interface ISuccessfulTransactionModalValue {
  openSuccessfulTransactionModal: (params: OpenSuccessfulTransactionModalInput) => void;
  closeSuccessfulTransactionModal: () => void;
}

export const SuccessfulTransactionModalContext =
  React.createContext<ISuccessfulTransactionModalValue>({
    openSuccessfulTransactionModal: noop,
    closeSuccessfulTransactionModal: noop,
  });

export const SuccessfulTransactionModalProvider: React.FC = ({ children }) => {
  const [isOpened, setIsOpened] = React.useState(false);
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
      if (!isOpened) {
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
          isOpened={isOpened}
          handleClose={closeSuccessfulTransactionModal}
          {...modalProps}
        />
      )}

      {children}
    </SuccessfulTransactionModalContext.Provider>
  );
};
