import { useEffect } from 'react';

import { useLunaUstWarning } from '../useLunaUstWarning';
import { Modal } from './Modal';

export const LunaUstWarningModal: React.FC = () => {
  const {
    isLunaUstWarningModalOpen,
    closeLunaUstWarningModal,
    openLunaUstWarningModal,
    userHasLunaOrUstCollateralEnabled,
    hasLunaUstWarningModalBeenOpened,
  } = useLunaUstWarning();

  useEffect(() => {
    if (userHasLunaOrUstCollateralEnabled && !hasLunaUstWarningModalBeenOpened) {
      openLunaUstWarningModal();
    }
  }, [
    openLunaUstWarningModal,
    userHasLunaOrUstCollateralEnabled,
    hasLunaUstWarningModalBeenOpened,
  ]);

  return <Modal isOpen={isLunaUstWarningModalOpen} onClose={closeLunaUstWarningModal} />;
};
