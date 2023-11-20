import { Button, Icon, Modal as ModalComp, ModalProps as ModalCompProps } from 'components';
import { useTranslation } from 'packages/translations';

export interface ModalProps {
  isOpen: ModalCompProps['isOpen'];
  onClose: ModalCompProps['handleClose'];
}

export const Modal: React.FC<ModalProps> = ({ onClose, isOpen }) => {
  const { t } = useTranslation();

  return (
    <ModalComp isOpen={isOpen} handleClose={onClose}>
      <>
        <Icon name="attention" className="mx-auto mb-6 h-16 w-16 text-orange" />

        <h2 className="mb-3 text-center text-xl">{t('lunaUstWarningModal.title')}</h2>

        <p className="mb-10 text-grey">{t('lunaUstWarningModal.content')}</p>

        <Button onClick={onClose} variant="secondary" className="w-full">
          {t('lunaUstWarningModal.closeButtonLabel')}
        </Button>
      </>
    </ModalComp>
  );
};
