import { useShouldDisplayImportUi } from 'hooks/useShouldDisplayImportUi';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useAccountAddress } from 'libs/wallet';
import { Suspense } from 'react';
import { safeLazyLoad } from 'utilities';

const Modal = safeLazyLoad(() => import('./Modal'));

const ImportPositionsModal: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const [userChainSettings] = useUserChainSettings();
  const { shouldDisplayImportUi } = useShouldDisplayImportUi();

  if (
    !accountAddress ||
    !shouldDisplayImportUi ||
    userChainSettings.doNotShowImportPositionsModal
  ) {
    return undefined;
  }

  return (
    <Suspense>
      <Modal />
    </Suspense>
  );
};

export default ImportPositionsModal;
