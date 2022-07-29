import noop from 'noop-ts';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { useGetUserMarketInfo } from 'clients/api';
import { LunaUstWarningModal } from 'components/LunaUstWarningModal';
import { TOKENS } from 'constants/tokens';
import { AuthContext } from 'context/AuthContext';

export interface DisableLunaUstWarningContextValue {
  hasLunaOrUstCollateralEnabled: boolean;
  shouldShowLunaUstWarningModal: boolean;
  openLunaUstWarningModal: () => void;
  closeLunaUstWarningModal: () => void;
}

export const DisableLunaUstWarningContext = React.createContext<DisableLunaUstWarningContextValue>({
  hasLunaOrUstCollateralEnabled: false,
  shouldShowLunaUstWarningModal: false,
  openLunaUstWarningModal: noop,
  closeLunaUstWarningModal: noop,
});

export const DisableLunaUstWarningProvider: React.FC = ({ children }) => {
  const { account } = useContext(AuthContext);
  const accountAddress = account?.address || '';
  const {
    data: { assets },
  } = useGetUserMarketInfo({
    accountAddress,
  });

  const [shouldShowLunaUstWarningModal, setShouldShowModal] = useState(false);

  const hasLunaOrUstCollateralEnabled = useMemo(
    () =>
      assets.some(
        asset => (asset.id === TOKENS.luna.id || asset.id === TOKENS.ust.id) && asset.collateral,
      ),
    [JSON.stringify(assets)],
  );

  useEffect(() => {
    setShouldShowModal(hasLunaOrUstCollateralEnabled);
  }, [hasLunaOrUstCollateralEnabled]);

  const openLunaUstWarningModal = () => setShouldShowModal(true);
  const closeLunaUstWarningModal = () => setShouldShowModal(false);

  return (
    <DisableLunaUstWarningContext.Provider
      value={{
        openLunaUstWarningModal,
        closeLunaUstWarningModal,
        hasLunaOrUstCollateralEnabled,
        shouldShowLunaUstWarningModal,
      }}
    >
      <>
        {shouldShowLunaUstWarningModal && (
          <LunaUstWarningModal onClose={closeLunaUstWarningModal} />
        )}

        {children}
      </>
    </DisableLunaUstWarningContext.Provider>
  );
};
