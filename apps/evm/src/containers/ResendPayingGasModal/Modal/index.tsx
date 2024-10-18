import { Button, Icon, Modal as ModalComp, type ModalProps as ModalCompProps } from 'components';
import type { BaseContract } from 'ethers';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { handleError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { store } from '../store';
import type { LastFailedGaslessTransaction } from '../types';

export interface ModalProps<
  TMutateInput extends Record<string, unknown> | void,
  TContract extends BaseContract,
  TMethodName extends string & keyof TContract['functions'],
> extends Omit<ModalCompProps, 'isOpen' | 'children' | 'handleClose'> {
  lastFailedGaslessTransaction: LastFailedGaslessTransaction<TMutateInput, TContract, TMethodName>;
}

export function Modal<
  TMutateInput extends Record<string, unknown> | void,
  TContract extends BaseContract,
  TMethodName extends string & keyof TContract['functions'],
>({
  lastFailedGaslessTransaction: { mutationInput, ...sendTransactionHookInput },
  ...otherProps
}: ModalProps<TMutateInput, TContract, TMethodName>) {
  const { t } = useTranslation();
  const closeModal = store.use.closeModal();
  const { mutateAsync: sendTransaction, isPending: isSendingTransaction } = useSendTransaction({
    ...sendTransactionHookInput,
    options: {
      ...sendTransactionHookInput.options,
      tryGasless: false,
    },
  });

  const onSubmit = async () => {
    try {
      await sendTransaction(mutationInput);

      closeModal();
    } catch (error) {
      handleError({ error });
    }
  };

  return (
    <ModalComp isOpen handleClose={closeModal} {...otherProps}>
      <div className="flex flex-col">
        <div className="flex flex-col items-center justify-center mb-3">
          <Icon name="gasSad" className="h-16 w-16 text-orange mb-6" />

          <h4 className="text-center font-semibold text-xl">
            {t('gaslessTransactions.errorModal.title')}
          </h4>
        </div>

        <p className="text-center text-grey mb-8">
          {t('gaslessTransactions.errorModal.description')}
        </p>

        <Button onClick={onSubmit} loading={isSendingTransaction} className="mb-2">
          {t('gaslessTransactions.errorModal.resendButtonLabel')}
        </Button>

        <Button onClick={closeModal} variant="text">
          {t('gaslessTransactions.errorModal.cancel')}
        </Button>
      </div>
    </ModalComp>
  );
}
