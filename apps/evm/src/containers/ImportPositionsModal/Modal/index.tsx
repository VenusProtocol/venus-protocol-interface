import { Modal as ModalComp } from 'components';
import { useAnalytics } from 'libs/analytics';
import { useTranslation } from 'libs/translations';

import ImportablePositions from 'containers/ImportablePositions';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useEffect } from 'react';

const Modal: React.FC = () => {
  const { t } = useTranslation();
  const { captureAnalyticEvent } = useAnalytics();
  const [_, setUserChainSettings] = useUserChainSettings();

  useEffect(() => {
    captureAnalyticEvent('Import positions modal displayed', {});
  }, [captureAnalyticEvent]);

  const handleClose = () => {
    setUserChainSettings({
      doNotShowImportPositionsModal: true,
    });

    captureAnalyticEvent('Import positions modal closed', {});
  };

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
