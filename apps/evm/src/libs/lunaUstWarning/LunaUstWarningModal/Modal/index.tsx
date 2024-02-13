import { Button, Icon, Modal as ModalComp, ModalProps as ModalCompProps } from 'components';
import { useTranslation } from 'libs/translations';

export interface ModalProps {
  isOpen: ModalCompProps['isOpen'];
  onClose: ModalCompProps['handleClose'];
}

export const Modal: React.FC<ModalProps> = ({ onClose, isOpen }) => {
  const { t } = useTranslation();

  return (
    <ModalComp isOpen={isOpen} handleClose={onClose}>
      <>
        <Icon name="attention" className="text-orange mx-auto mb-6 h-16 w-16" />

        <h2 className="mb-3 text-center text-xl">{t('lunaUstWarningModal.title')}</h2>

        <p className="text-grey mb-10">{t('lunaUstWarningModal.content')}</p>

        <Button onClick={onClose} variant="secondary" className="w-full">
          {t('lunaUstWarningModal.closeButtonLabel')}
        </Button>
      </>
    </ModalComp>
  );
};
