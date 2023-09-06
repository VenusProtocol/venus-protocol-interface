import BigNumber from 'bignumber.js';
import { VError } from 'errors';
import { getGenericContract } from 'packages/contracts';
import React, { useCallback, useContext, useState } from 'react';
import { Asset } from 'types';
import { areAddressesEqual, getVTokenContract } from 'utilities';

import {
  getHypotheticalAccountLiquidity,
  getVTokenBalanceOf,
  useEnterMarket,
  useExitMarket,
} from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { useAuth } from 'context/AuthContext';
import { DisableLunaUstWarningContext } from 'context/DisableLunaUstWarning';
import useGetUniqueContract from 'hooks/useGetUniqueContract';

import { CollateralConfirmModal } from './CollateralConfirmModal';

const useCollateral = () => {
  const { accountAddress, signer } = useAuth();
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>(undefined);
  const { hasLunaOrUstCollateralEnabled } = useContext(DisableLunaUstWarningContext);

  const { mutateAsync: enterMarket } = useEnterMarket();
  const { mutateAsync: exitMarket } = useExitMarket();

  const mainPoolComptrollerContract = useGetUniqueContract({
    name: 'mainPoolComptroller',
    passSigner: true,
  });

  const contractToggleCollateral = async ({
    asset,
    comptrollerAddress,
    poolName,
  }: {
    asset: Asset;
    comptrollerAddress: string;
    poolName: string;
  }) => {
    if (!signer || !accountAddress) {
      throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
    }

    const comptrollerContract = areAddressesEqual(
      comptrollerAddress,
      mainPoolComptrollerContract?.address || '',
    )
      ? mainPoolComptrollerContract
      : getGenericContract({
          name: 'isolatedPoolComptroller',
          address: comptrollerAddress,
          signerOrProvider: signer,
        });

    if (!comptrollerContract) {
      throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
    }

    if (asset.isCollateralOfUser) {
      const vTokenContract = getVTokenContract({ vToken: asset.vToken, signerOrProvider: signer });

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

        if (+assetHypotheticalLiquidity['1'] === 0 && +assetHypotheticalLiquidity['2'] > 0) {
          throw new VError({
            type: 'interaction',
            code: 'collateralRequired',
            data: {
              assetName: asset.vToken.underlyingToken.symbol,
            },
          });
        }

        await exitMarket({
          vToken: asset.vToken,
          poolName,
          comptrollerContract,
          userSupplyBalanceTokens: asset.supplyBalanceTokens,
        });
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
        await enterMarket({
          vToken: asset.vToken,
          poolName,
          comptrollerContract,
          userSupplyBalanceTokens: asset.supplyBalanceTokens,
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
    poolName,
  }: {
    asset: Asset;
    comptrollerAddress: string;
    poolName: string;
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
        poolName,
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
