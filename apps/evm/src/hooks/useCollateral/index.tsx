import { getVTokenBalance, useEnterMarket, useExitMarket } from 'clients/api';
import {
  getIsolatedPoolComptrollerContract,
  isolatedPoolComptrollerAbi,
  useGetLegacyPoolComptrollerContract,
} from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, usePublicClient, useSigner } from 'libs/wallet';
import type { Asset } from 'types';
import { areAddressesEqual } from 'utilities';
import type { Address } from 'viem';

const useCollateral = () => {
  const { signer } = useSigner();
  const { accountAddress } = useAccountAddress();
  const { publicClient } = usePublicClient();

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
    comptrollerAddress: Address;
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
      try {
        const vTokenBalanceOf = await getVTokenBalance({
          publicClient,
          vTokenAddress: asset.vToken.address,
          accountAddress,
        });

        const assetHypotheticalLiquidity = await publicClient.readContract({
          abi: isolatedPoolComptrollerAbi,
          address: comptrollerAddress,
          functionName: 'getHypotheticalAccountLiquidity',
          args: [
            accountAddress,
            asset.vToken.address,
            BigInt(vTokenBalanceOf.balanceMantissa.toFixed()),
            0n, // vToken borrow balance
          ],
        });

        if (assetHypotheticalLiquidity[1] === 0n && assetHypotheticalLiquidity[2] > 0n) {
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
    comptrollerAddress: Address;
    poolName: string;
  }) => {
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
