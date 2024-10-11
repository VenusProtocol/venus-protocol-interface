import { Button, Modal, type ModalProps } from 'components';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useTranslation } from 'libs/translations';
import { gasOrange } from 'libs/wallet/img/icons';
import { create } from 'zustand';

interface ResendPayingGasModalStore {
  isOpen: boolean;
  txInput: Parameters<typeof useSendTransaction>[0];
  mutationInput: any;
  openModal: (txInput: any, mutationInput: any) => void;
  closeModal: () => void;
}

export const useResendPayingGasModalStore = create<ResendPayingGasModalStore>(set => ({
  isOpen: false,
  // @ts-expect-error object is incomplete
  txInput: {},
  mutationInput: undefined,
  openModal: (txInput: any, mutationInput: any) =>
    set({
      isOpen: true,
      txInput: {
        ...txInput,
        options: {
          ...txInput.options,
          disableGaslessTransaction: true,
        },
      },
      mutationInput,
    }),
  closeModal: () => set({ isOpen: false }),
}));

export type ResendPayingGasModalProps = Pick<ModalProps, 'handleClose'>;

const ResendPayingGasModal: React.FC = () => {
  const { t } = useTranslation();
  const { isOpen, closeModal, txInput, mutationInput } = useResendPayingGasModalStore();
  const { mutateAsync: resendTokenAsync } = useSendTransaction(txInput);

  return (
    <Modal isOpen={isOpen} handleClose={closeModal} hideCloseButton>
      <div className="flex flex-col">
        <div className="flex flex-col items-center justify-center">
          <img
            src={gasOrange}
            alt={t('gaslessTransactions.errorModal.title')}
            className="h-16 w-16"
          />
          <h4 className="text-center font-semibold text-xl mt-6">
            {t('gaslessTransactions.errorModal.title')}
          </h4>
        </div>
        <p className="text-center text-grey mb-8">
          {t('gaslessTransactions.errorModal.description')}
        </p>
        <Button
          onClick={() => {
            resendTokenAsync(mutationInput);
            closeModal();
          }}
        >
          {t('gaslessTransactions.errorModal.resendButtonLabel')}
        </Button>
        <Button onClick={closeModal} variant="text" className="mt-3">
          {t('gaslessTransactions.errorModal.cancel')}
        </Button>
      </div>
    </Modal>
  );
};

export default ResendPayingGasModal;
