import BigNumber from 'bignumber.js';

import {
  getHypotheticalAccountLiquidity,
  getVTokenBalanceOf,
  useEnterMarket,
  useExitMarket,
} from 'clients/api';
import {
  getIsolatedPoolComptrollerContract,
  getVTokenContract,
  useGetLegacyPoolComptrollerContract,
} from 'libs/contracts';
import { VError } from 'libs/errors';
import { useLunaUstWarning } from 'libs/lunaUstWarning';
import { useAccountAddress, useSigner } from 'libs/wallet';
import type { Asset } from 'types';
import { areAddressesEqual } from 'utilities';

const useCollateral = () => {
  const { signer } = useSigner();
  const { accountAddress } = useAccountAddress();
  const { userHasLunaOrUstCollateralEnabled } = useLunaUstWarning();

  const { mutateAsync: enterMarket } = useEnterMarket({
    waitForConfirmation: true,
  });
  const { mutateAsync: exitMarket } = useExitMarket({
    waitForConfirmation: true,
  });

  const legacyPoolComptrollerContract = useGetLegacyPoolComptrollerContract({
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
      legacyPoolComptrollerContract?.address || '',
    )
      ? legacyPoolComptrollerContract
      : getIsolatedPoolComptrollerContract({
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
          vTokenBalanceOfMantissa: new BigNumber(vTokenBalanceOf.balanceMantissa),
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
      userHasLunaOrUstCollateralEnabled &&
      asset.vToken.underlyingToken.symbol !== 'UST' &&
      asset.vToken.underlyingToken.symbol !== 'LUNA'
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

    return contractToggleCollateral({
      asset,
      comptrollerAddress,
      poolName,
    });
  };

  return {
    toggleCollateral,
  };
};

export default useCollateral;
