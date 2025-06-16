import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { Suspense } from 'react';
import { Modal } from './Modal';

export const ImportPositionsModal: React.FC = () => {
  const isImportPositionsFeatureEnabled = useIsFeatureEnabled({
    name: 'importPositions',
  });

  if (!isImportPositionsFeatureEnabled) {
    return undefined;
  }

  return (
    <Suspense>
      <Modal />
    </Suspense>
  );
};
