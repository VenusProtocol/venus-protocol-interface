import { useShouldDisplayImportUi } from 'hooks/useShouldDisplayImportUi';
import { useAccountAddress } from 'libs/wallet';
import { Suspense } from 'react';
import { safeLazyLoad } from 'utilities';
import { store } from './store';

const Modal = safeLazyLoad(() => import('./Modal'));

const ImportPositionsModal: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const doNotShowAgainFor = store.use.doNotShowAgainFor();

  const { shouldDisplayImportUi } = useShouldDisplayImportUi();

  if (!accountAddress || !shouldDisplayImportUi || doNotShowAgainFor.includes(accountAddress)) {
    return undefined;
  }

  return (
    <Suspense>
      <Modal />
    </Suspense>
  );
};

export default ImportPositionsModal;
