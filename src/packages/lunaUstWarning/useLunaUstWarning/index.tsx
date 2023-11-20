import { useMemo } from 'react';

import { useGetLegacyPool } from 'clients/api';
import { useAuth } from 'context/AuthContext';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

import { store } from './store';

export const useLunaUstWarning = () => {
  const isLunaUstWarningFeatureEnabled = useIsFeatureEnabled({
    name: 'lunaUstWarning',
  });

  const { accountAddress } = useAuth();
  const { data: getLegacyPoolData } = useGetLegacyPool({
    accountAddress,
  });

  const isLunaUstWarningModalOpen = store.use.isModalOpen();
  const setIsModalOpen = store.use.setIsModalOpen();

  const openLunaUstWarningModal = () => setIsModalOpen({ isModalOpen: true });
  const closeLunaUstWarningModal = () => setIsModalOpen({ isModalOpen: false });

  const userHasLunaOrUstCollateralEnabled = useMemo(
    () =>
      isLunaUstWarningFeatureEnabled &&
      !!getLegacyPoolData &&
      getLegacyPoolData?.pool.assets.some(
        asset =>
          (asset.vToken.underlyingToken.symbol === 'LUNA' ||
            asset.vToken.underlyingToken.symbol === 'UST') &&
          asset.isCollateralOfUser,
      ),
    [getLegacyPoolData, isLunaUstWarningFeatureEnabled],
  );

  return {
    userHasLunaOrUstCollateralEnabled,
    openLunaUstWarningModal,
    closeLunaUstWarningModal,
    isLunaUstWarningModalOpen,
  };
};
