import { useAccountAddress } from 'libs/wallet';
import { useCallback, useMemo } from 'react';

import { useGetLegacyPool } from 'clients/api';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

import { store } from './store';

export const useLunaUstWarning = () => {
  const isLunaUstWarningFeatureEnabled = useIsFeatureEnabled({
    name: 'lunaUstWarning',
  });

  const { accountAddress } = useAccountAddress();
  const { data: getLegacyPoolData } = useGetLegacyPool({
    accountAddress,
  });

  const isLunaUstWarningModalOpen = store.use.isModalOpen();

  const setIsModalOpen = store.use.setIsModalOpen();
  const hasLunaUstWarningModalBeenOpened = store.use.wasModalOpenedThisSession();

  const openLunaUstWarningModal = useCallback(
    () => setIsModalOpen({ isModalOpen: true }),
    [setIsModalOpen],
  );
  const closeLunaUstWarningModal = useCallback(
    () => setIsModalOpen({ isModalOpen: false }),
    [setIsModalOpen],
  );

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
    hasLunaUstWarningModalBeenOpened,
  };
};
