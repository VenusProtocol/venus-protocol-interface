import { useEffect } from 'react';

import { useLunaUstWarning } from '../useLunaUstWarning';
import { Modal } from './Modal';

export const LunaUstWarningModal: React.FC = () => {
  const {
    isLunaUstWarningModalOpen,
    closeLunaUstWarningModal,
    openLunaUstWarningModal,
    userHasLunaOrUstCollateralEnabled,
  } = useLunaUstWarning();

  useEffect(() => {
    if (userHasLunaOrUstCollateralEnabled) {
      openLunaUstWarningModal();
    }
  }, [openLunaUstWarningModal, userHasLunaOrUstCollateralEnabled]);

  return <Modal isOpen={isLunaUstWarningModalOpen} onClose={closeLunaUstWarningModal} />;
};
