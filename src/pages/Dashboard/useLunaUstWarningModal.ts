import { useEffect, useState } from 'react';

import { Asset } from 'types';

const SESSION_STORAGE_KEY = 'has-seen-modal-this-session';

const useLunaUstWarningModal = (assets: Asset[]): [boolean, () => void] => {
  const [shouldShowModal, setShouldShowModal] = useState(false);

  useEffect(() => {
    const hasDeprecatedCollateralEnabled = assets.some(
      asset => (asset.id === 'luna' || asset.id === 'ust') && asset.collateral,
    );
    const hasSeenModalThisSession = !!sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (hasDeprecatedCollateralEnabled && !hasSeenModalThisSession && !shouldShowModal) {
      setShouldShowModal(true);
    }
  }, [JSON.stringify(assets)]);

  const closeModal = () => {
    // Mark modal as seen in session storage
    sessionStorage.setItem(SESSION_STORAGE_KEY, '1');
    setShouldShowModal(false);
  };

  return [shouldShowModal, closeModal];
};

export default useLunaUstWarningModal;
