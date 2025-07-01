import { Modal as ModalComp } from 'components';
import { useTranslation } from 'libs/translations';

import ImportablePositions from 'containers/ImportablePositions';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useAccountAddress } from 'libs/wallet';

const Modal: React.FC = () => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const [_, setUserChainSettings] = useUserChainSettings();

  if (!accountAddress) {
    return undefined;
  }

  const handleClose = () =>
    setUserChainSettings({
      doNotShowImportPositionsModal: true,
    });

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
