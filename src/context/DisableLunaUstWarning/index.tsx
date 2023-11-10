import { LunaUstWarningModal } from 'components';
import noop from 'noop-ts';
import React, { useEffect, useMemo, useState } from 'react';

import { useGetMainPool } from 'clients/api';
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

export interface DisableLunaUstWarningProviderProps {
  children?: React.ReactNode;
}

export const DisableLunaUstWarningProvider: React.FC<DisableLunaUstWarningProviderProps> = ({
  children,
}) => {
  const { accountAddress } = useAuth();
  const { data: getMainPoolData } = useGetMainPool({
    accountAddress,
  });

  const [isLunaUstWarningModalOpen, setIsLunaUstWarningModalOpen] = useState(false);

  const hasLunaOrUstCollateralEnabled = useMemo(
    () =>
      !!getMainPoolData &&
      getMainPoolData?.pool.assets.some(
        asset =>
          (asset.vToken.underlyingToken.symbol === 'LUNA' ||
            asset.vToken.underlyingToken.symbol === 'UST') &&
          asset.isCollateralOfUser,
      ),
    [getMainPoolData],
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
