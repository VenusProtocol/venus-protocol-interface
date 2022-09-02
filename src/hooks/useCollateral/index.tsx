import BigNumber from 'bignumber.js';
import { VError } from 'errors';
import React, { useCallback, useContext, useState } from 'react';
import { Asset, VTokenId } from 'types';

import {
  getHypotheticalAccountLiquidity,
  getVTokenBalanceOf,
  useEnterMarkets,
  useExitMarket,
} from 'clients/api';
import { getVTokenContract, useComptrollerContract } from 'clients/contracts';
import { useWeb3 } from 'clients/web3';
import { TOKENS } from 'constants/tokens';
import { AuthContext } from 'context/AuthContext';
import { DisableLunaUstWarningContext } from 'context/DisableLunaUstWarning';

import { CollateralConfirmModal } from './CollateralConfirmModal';

const useCollateral = () => {
  const { account } = useContext(AuthContext);
  const accountAddress = account?.address;

  const web3 = useWeb3();
  const comptrollerContract = useComptrollerContract();

  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>(undefined);

  const { hasLunaOrUstCollateralEnabled } = useContext(DisableLunaUstWarningContext);

  const { mutateAsync: enterMarkets } = useEnterMarkets({
    onSettled: () => setSelectedAsset(undefined),
  });

  const { mutateAsync: exitMarket } = useExitMarket({
    onSettled: () => setSelectedAsset(undefined),
  });

  const toggleCollateral = async (asset: Asset) => {
    // Prevent action if user has UST or LUNA enabled as collateral while trying
    // to enable/disable a different token
    if (
      hasLunaOrUstCollateralEnabled &&
      asset.id !== TOKENS.ust.id &&
      asset.id !== TOKENS.luna.id
    ) {
      return;
    }

    if (!accountAddress) {
      throw new VError({
        type: 'interaction',
        code: 'accountError',
      });
    }

    if (!asset || !asset.borrowBalance.isZero()) {
      throw new VError({
        type: 'interaction',
        code: 'collateralRequired',
      });
    }

    setSelectedAsset(asset);

    if (asset.collateral) {
      const vTokenContract = getVTokenContract(asset.id as VTokenId, web3);

      try {
        const vTokenBalanceOf = await getVTokenBalanceOf({
          vTokenContract,
          accountAddress,
        });

        const assetHypotheticalLiquidity = await getHypotheticalAccountLiquidity({
          comptrollerContract,
          accountAddress,
          vTokenAddress: asset.vtokenAddress,
          vTokenBalanceOfWei: new BigNumber(vTokenBalanceOf.balanceWei),
        });

        if (+assetHypotheticalLiquidity['1'] > 0 || +assetHypotheticalLiquidity['2'] === 0) {
          await exitMarket({ vtokenAddress: asset.vtokenAddress, accountAddress });
        }
      } catch (error) {
        if (error instanceof VError) {
          throw error;
        }

        throw new VError({
          type: 'interaction',
          code: 'collateralDisableError',
          data: {
            assetName: asset.symbol,
          },
        });
      }
    } else {
      try {
        await enterMarkets({ vTokenAddresses: [asset.vtokenAddress], accountAddress });
      } catch (error) {
        if (error instanceof VError) {
          throw error;
        }

        throw new VError({
          type: 'interaction',
          code: 'collateralEnableError',
          data: {
            assetName: asset.symbol,
          },
        });
      }
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
