import React from 'react';
import noop from 'noop-ts';

export interface ISuccessModalValue {
  openSuccessModal: () => void;
  closeSuccessModal: () => void;
}

export const SuccessModalContext = React.createContext<ISuccessModalValue>({
  openSuccessModal: noop,
  closeSuccessModal: noop,
});

export const SuccessModalProvider: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openSuccessModal = () => setIsOpen(true);
  const closeSuccessModal = () => setIsOpen(false);

  console.log(isOpen);

  return (
    <SuccessModalContext.Provider
      value={{
        openSuccessModal,
        closeSuccessModal,
      }}
    >
      {/* TODO: render success modal */}

      {children}
    </SuccessModalContext.Provider>
  );
};
