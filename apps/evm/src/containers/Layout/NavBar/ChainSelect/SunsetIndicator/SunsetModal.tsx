import { Modal } from 'components';
import { useTranslation } from 'libs/translations';
import { useSunsetModalStore } from '../sunsetModalStore';

export const SunsetModal: React.FC = () => {
  const { t } = useTranslation();
  const isOpen = useSunsetModalStore(state => state.isOpen);
  const close = useSunsetModalStore(state => state.close);

  return (
    <Modal isOpen={isOpen} handleClose={close} title={t('layout.sunsetModal.title')}>
      <p className="text-grey text-p2r">{t('layout.sunsetModal.description')}</p>
    </Modal>
  );
};
