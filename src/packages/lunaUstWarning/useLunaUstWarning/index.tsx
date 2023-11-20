import { useMemo } from 'react';

import { useGetMainPool } from 'clients/api';
import { useAuth } from 'context/AuthContext';

import { store } from './store';

export const useLunaUstWarning = () => {
  const { accountAddress } = useAuth();
  const { data: getMainPoolData } = useGetMainPool({
    accountAddress,
  });

  const isLunaUstWarningModalOpen = store.use.isModalOpen();
  const setIsModalOpen = store.use.setIsModalOpen();

  const openLunaUstWarningModal = () => setIsModalOpen({ isModalOpen: true });
  const closeLunaUstWarningModal = () => setIsModalOpen({ isModalOpen: false });

  const userHasLunaOrUstCollateralEnabled = useMemo(
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

  return {
    userHasLunaOrUstCollateralEnabled,
    openLunaUstWarningModal,
    closeLunaUstWarningModal,
    isLunaUstWarningModalOpen,
  };
};
