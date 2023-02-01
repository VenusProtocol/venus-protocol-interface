import noop from 'noop-ts';
import React, { useEffect, useMemo, useState } from 'react';
import { areTokensEqual } from 'utilities';

import { useGetMainAssets } from 'clients/api';
import { LunaUstWarningModal } from 'components/LunaUstWarningModal';
import { TOKENS } from 'constants/tokens';
import { useAuth } from 'context/AuthContext';

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
  const { account } = useAuth();
  const accountAddress = account?.address || '';
  const { data: getMainAssetsData } = useGetMainAssets({
    accountAddress,
  });

  const [isLunaUstWarningModalOpen, setIsLunaUstWarningModalOpen] = useState(false);

  const hasLunaOrUstCollateralEnabled = useMemo(
    () =>
      !!getMainAssetsData &&
      getMainAssetsData?.assets.some(
        asset =>
          (areTokensEqual(asset.vToken.underlyingToken, TOKENS.luna) ||
            areTokensEqual(asset.vToken.underlyingToken, TOKENS.ust)) &&
          asset.isCollateralOfUser,
      ),
    [getMainAssetsData?.assets],
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
