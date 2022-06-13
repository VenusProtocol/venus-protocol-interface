import { useState, useMemo } from 'react';

import { Asset } from 'types';

const SESSION_STORAGE_KEY = 'has-seen-modal-this-session';

const useLunaUstWarningModal = (assets: Asset[]): [boolean, () => void] => {
  const hasDeprecatedCollateral = useMemo(
    () => assets.some(asset => (asset.id === 'luna' || asset.id === 'ust') && asset.collateral),
    [JSON.stringify(assets)],
  );

  const hasSeenModalThisSession = !!sessionStorage.getItem(SESSION_STORAGE_KEY);

  const [shouldShowModal, setShouldShowModal] = useState(
    !!hasDeprecatedCollateral && !hasSeenModalThisSession,
  );

  const closeModal = () => {
    // Mark modal as seen in session storage
    sessionStorage.setItem(SESSION_STORAGE_KEY, '1');
    setShouldShowModal(false);
  };

  return [shouldShowModal, closeModal];
};

export default useLunaUstWarningModal;
