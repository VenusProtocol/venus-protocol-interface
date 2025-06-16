import { Modal as ModalComp } from 'components';
import { useTranslation } from 'libs/translations';

import ImportablePositions from 'containers/ImportablePositions';
import { useAccountAddress } from 'libs/wallet';
import { store } from '../store';

const Modal: React.FC = () => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();

  if (!accountAddress) {
    return undefined;
  }

  const hideModal = store.use.hideModal();
  const handleClose = () => hideModal({ accountAddress });

  return (
    <ModalComp
      isOpen
      handleClose={handleClose}
      title={t('importPositionsModal.title')}
      className="max-w-[800px]"
    >
      <ImportablePositions />
    </ModalComp>
  );
};

export default Modal;
