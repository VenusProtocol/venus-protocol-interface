import BigNumber from 'bignumber.js';
import { VError } from 'errors';
import React, { useCallback, useContext, useState } from 'react';
import { Asset } from 'types';

import {
  getHypotheticalAccountLiquidity,
  getVTokenBalanceOf,
  useEnterMarkets,
  useExitMarket,
} from 'clients/api';
import { getComptrollerContract, getVTokenContract } from 'clients/contracts';
import { TOKENS } from 'constants/tokens';
import { useAuth } from 'context/AuthContext';
import { DisableLunaUstWarningContext } from 'context/DisableLunaUstWarning';

import { CollateralConfirmModal } from './CollateralConfirmModal';

const useCollateral = () => {
  const { accountAddress, signer } = useAuth();
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>(undefined);
  const { hasLunaOrUstCollateralEnabled } = useContext(DisableLunaUstWarningContext);

  const { mutateAsync: enterMarkets } = useEnterMarkets();
  const { mutateAsync: exitMarket } = useExitMarket();

  const contractToggleCollateral = async ({
    asset,
    comptrollerAddress,
  }: {
    asset: Asset;
    comptrollerAddress: string;
  }) => {
    const comptrollerContract = getComptrollerContract(comptrollerAddress, signer);

    if (asset.isCollateralOfUser) {
      const vTokenContract = getVTokenContract(asset.vToken, signer);

      try {
        const vTokenBalanceOf = await getVTokenBalanceOf({
          vTokenContract,
          accountAddress,
        });

        const assetHypotheticalLiquidity = await getHypotheticalAccountLiquidity({
          comptrollerContract,
          accountAddress,
          vTokenAddress: asset.vToken.address,
          vTokenBalanceOfWei: new BigNumber(vTokenBalanceOf.balanceWei),
        });

        if (+assetHypotheticalLiquidity['1'] > 0 || +assetHypotheticalLiquidity['2'] === 0) {
          await exitMarket({ vTokenAddress: asset.vToken.address, comptrollerContract });
        }
      } catch (error) {
        if (error instanceof VError) {
          throw error;
        }

        throw new VError({
          type: 'interaction',
          code: 'collateralDisableError',
          data: {
            assetName: asset.vToken.underlyingToken.symbol,
          },
        });
      }
    } else {
      try {
        await enterMarkets({
          vTokenAddresses: [asset.vToken.address],
          comptrollerContract,
        });
      } catch (error) {
        if (error instanceof VError) {
          throw error;
        }

        throw new VError({
          type: 'interaction',
          code: 'collateralEnableError',
          data: {
            assetName: asset.vToken.underlyingToken.symbol,
          },
        });
      }
    }
  };

  const toggleCollateral = async ({
    asset,
    comptrollerAddress,
  }: {
    asset: Asset;
    comptrollerAddress: string;
  }) => {
    // Prevent action if user has UST or LUNA enabled as collateral while trying
    // to enable/disable a different token
    if (
      hasLunaOrUstCollateralEnabled &&
      asset.vToken.underlyingToken.address !== TOKENS.ust.address &&
      asset.vToken.underlyingToken.address !== TOKENS.luna.address
    ) {
      return;
    }

    if (!accountAddress) {
      throw new VError({
        type: 'interaction',
        code: 'accountError',
      });
    }

    if (!asset || !asset.userBorrowBalanceTokens.isZero()) {
      throw new VError({
        type: 'interaction',
        code: 'collateralRequired',
      });
    }

    setSelectedAsset(asset);

    try {
      await contractToggleCollateral({
        asset,
        comptrollerAddress,
      });
    } finally {
      setSelectedAsset(undefined);
    }
  };

  const CollateralModal: React.FC = useCallback(
    () => (
      <CollateralConfirmModal
        asset={selectedAsset}
        handleClose={() => setSelectedAsset(undefined)}
      />
    ),
    [selectedAsset],
  );

  return {
    toggleCollateral,
    CollateralModal,
  };
};

export default useCollateral;
