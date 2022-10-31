import noop from 'noop-ts';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { useGetUserMarketInfo } from 'clients/api';
import { LunaUstWarningModal } from 'components/LunaUstWarningModal';
import { TOKENS } from 'constants/tokens';
import { AuthContext } from 'context/AuthContext';

export interface DisableLunaUstWarningContextValue {
  hasLunaOrUstCollateralEnabled: boolean;
  isLunaUstWarningModalOpen: boolean;
  openLunaUstWarningModal: () => void;
  closeLunaUstWarningModal: () => void;
}

export const DisableLunaUstWarningContext = React.createContext<DisableLunaUstWarningContextValue>({
  hasLunaOrUstCollateralEnabled: false,
  isLunaUstWarningModalOpen: false,
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

  const [isLunaUstWarningModalOpen, setIsLunaUstWarningModalOpen] = useState(false);

  const hasLunaOrUstCollateralEnabled = useMemo(
    () =>
      assets.some(
        asset =>
          (asset.token.address === TOKENS.luna.address ||
            asset.token.address === TOKENS.ust.address) &&
          asset.collateral,
      ),
    [JSON.stringify(assets)],
  );

  useEffect(() => {
    setIsLunaUstWarningModalOpen(hasLunaOrUstCollateralEnabled);
  }, [hasLunaOrUstCollateralEnabled]);

  const openLunaUstWarningModal = () => setIsLunaUstWarningModalOpen(true);
  const closeLunaUstWarningModal = () => setIsLunaUstWarningModalOpen(false);

  return (
    <DisableLunaUstWarningContext.Provider
      value={{
        openLunaUstWarningModal,
        closeLunaUstWarningModal,
        hasLunaOrUstCollateralEnabled,
        isLunaUstWarningModalOpen,
      }}
    >
      <>
        {isLunaUstWarningModalOpen && <LunaUstWarningModal onClose={closeLunaUstWarningModal} />}

        {children}
      </>
    </DisableLunaUstWarningContext.Provider>
  );
};
