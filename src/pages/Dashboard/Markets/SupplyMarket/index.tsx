/** @jsxImportSource @emotion/react */
import { Paper } from '@mui/material';
import BigNumber from 'bignumber.js';
import { Delimiter, TableProps, switchAriaLabel, toast } from 'components';
import { VError, formatVErrorToReadableString } from 'errors';
import React, { useContext, useState } from 'react';
import { Asset } from 'types';
import { unsafelyGetVToken } from 'utilities';

import {
  getHypotheticalAccountLiquidity,
  getVTokenBalanceOf,
  useEnterMarkets,
  useExitMarket,
} from 'clients/api';
import { getVTokenContract, useComptrollerContract } from 'clients/contracts';
import { useWeb3 } from 'clients/web3';
import { TOKENS } from 'constants/tokens';
import { DisableLunaUstWarningContext } from 'context/DisableLunaUstWarning';

import { SupplyWithdrawModal } from '../../Modals';
import { useStyles } from '../styles';
import { CollateralConfirmModal } from './CollateralConfirmModal';
import SuppliedTable from './SuppliedTable';
import SupplyMarketTable from './SupplyMarketTable';

interface SupplyMarketProps {
  className?: string;
  isXvsEnabled: boolean;
  suppliedAssets: Asset[];
  supplyMarketAssets: Asset[];
  toggleAssetCollateral: (a: Asset) => Promise<void>;
  confirmCollateral: Asset | undefined;
  setConfirmCollateral: (asset: Asset | undefined) => void;
  hasLunaOrUstCollateralEnabled: boolean;
  openLunaUstWarningModal: () => void;
}

export const SupplyMarketUi: React.FC<SupplyMarketProps> = ({
  className,
  isXvsEnabled,
  supplyMarketAssets,
  suppliedAssets,
  hasLunaOrUstCollateralEnabled,
  openLunaUstWarningModal,
  toggleAssetCollateral,
  confirmCollateral,
  setConfirmCollateral,
}) => {
  const [selectedAssetId, setSelectedAssetId] = React.useState<Asset['token']['id'] | undefined>(
    undefined,
  );
  const styles = useStyles();

  const collateralOnChange = async (asset: Asset) => {
    try {
      await toggleAssetCollateral(asset);
    } catch (e) {
      if (e instanceof VError) {
        toast.error({
          message: formatVErrorToReadableString(e),
        });
      }
    }
  };

  const rowOnClick = (e: React.MouseEvent<HTMLElement>, row: TableProps['data'][number]) => {
    const assetId = row[0].value as string;

    // Block action and show warning modal if user has LUNA or UST enabled as
    // collateral and is attempting to open the supply modal of other assets
    if (hasLunaOrUstCollateralEnabled && assetId !== TOKENS.luna.id && assetId !== TOKENS.ust.id) {
      openLunaUstWarningModal();
      return;
    }

    if ((e.target as HTMLElement).ariaLabel !== switchAriaLabel) {
      setSelectedAssetId(assetId);
    }
  };

  const selectedAsset = React.useMemo(
    () =>
      [...supplyMarketAssets, ...suppliedAssets].find(
        marketAsset => marketAsset.token.id === selectedAssetId,
      ),
    [selectedAssetId, JSON.stringify(supplyMarketAssets), JSON.stringify(suppliedAssets)],
  );

  return (
    <Paper className={className} css={styles.tableContainer}>
      {suppliedAssets.length > 0 && (
        <>
          <SuppliedTable
            isXvsEnabled={isXvsEnabled}
            assets={suppliedAssets}
            rowOnClick={rowOnClick}
            collateralOnChange={collateralOnChange}
          />
          <Delimiter css={styles.delimiter} />
        </>
      )}
      <SupplyMarketTable
        isXvsEnabled={isXvsEnabled}
        assets={supplyMarketAssets}
        rowOnClick={rowOnClick}
        collateralOnChange={collateralOnChange}
      />
      <CollateralConfirmModal
        asset={confirmCollateral}
        handleClose={() => setConfirmCollateral(undefined)}
      />
      {selectedAsset && (
        <SupplyWithdrawModal
          asset={selectedAsset}
          assets={[...suppliedAssets, ...supplyMarketAssets]}
          isXvsEnabled={isXvsEnabled}
          onClose={() => setSelectedAssetId(undefined)}
        />
      )}
    </Paper>
  );
};

const SupplyMarket: React.FC<
  Pick<SupplyMarketProps, 'isXvsEnabled' | 'supplyMarketAssets' | 'suppliedAssets'> & {
    className?: string;
    accountAddress: string;
  }
> = ({ className, isXvsEnabled, supplyMarketAssets, suppliedAssets, accountAddress }) => {
  const web3 = useWeb3();
  const comptrollerContract = useComptrollerContract();

  const [confirmCollateral, setConfirmCollateral] = useState<Asset | undefined>(undefined);

  const { hasLunaOrUstCollateralEnabled, openLunaUstWarningModal } = useContext(
    DisableLunaUstWarningContext,
  );

  const { mutateAsync: enterMarkets } = useEnterMarkets({
    onSettled: () => setConfirmCollateral(undefined),
  });

  const { mutateAsync: exitMarket } = useExitMarket({
    onSettled: () => setConfirmCollateral(undefined),
  });

  const toggleAssetCollateral = async (asset: Asset) => {
    // Prevent action if user has UST or LUNA enabled as collateral while trying
    // to enable/disable a different token. Note that a warning modal will
    // automatically display thanks to the on click logic applied to each row
    // (see rowOnClick function above)
    if (
      hasLunaOrUstCollateralEnabled &&
      asset.token.id !== TOKENS.ust.id &&
      asset.token.id !== TOKENS.luna.id
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

    const vToken = unsafelyGetVToken(asset.token.id);

    if (asset.collateral) {
      const vTokenContract = getVTokenContract(asset.token.id, web3);

      let assetHypotheticalLiquidity;
      try {
        const vTokenBalanceOf = await getVTokenBalanceOf({
          vTokenContract,
          accountAddress,
        });

        assetHypotheticalLiquidity = await getHypotheticalAccountLiquidity({
          comptrollerContract,
          accountAddress,
          vTokenAddress: vToken.address,
          vTokenBalanceOfWei: new BigNumber(vTokenBalanceOf.balanceWei),
        });
      } catch (error) {
        if (error instanceof VError) {
          throw error;
        }

        throw new VError({
          type: 'interaction',
          code: 'collateralDisableError',
          data: { assetName: asset.token.symbol },
        });
      }

      if (+assetHypotheticalLiquidity['1'] > 0 || +assetHypotheticalLiquidity['2'] === 0) {
        try {
          setConfirmCollateral(asset);
          await exitMarket({ vtokenAddress: vToken.address, accountAddress });
        } catch (error) {
          if (error instanceof VError) {
            throw error;
          }

          throw new VError({
            type: 'interaction',
            code: 'collateralDisableError',
            data: {
              assetName: asset.token.symbol,
            },
          });
        }
      }

      return;
    }

    try {
      setConfirmCollateral(asset);
      await enterMarkets({ vTokenAddresses: [vToken.address], accountAddress });
    } catch (error) {
      if (error instanceof VError) {
        throw error;
      }
      throw new VError({
        type: 'interaction',
        code: 'collateralEnableError',
        data: {
          assetName: asset.token.symbol,
        },
      });
    }

    throw new VError({
      type: 'interaction',
      code: 'collateralRequired',
    });
  };

  return (
    <SupplyMarketUi
      className={className}
      suppliedAssets={suppliedAssets}
      supplyMarketAssets={supplyMarketAssets}
      isXvsEnabled={isXvsEnabled}
      toggleAssetCollateral={toggleAssetCollateral}
      confirmCollateral={confirmCollateral}
      setConfirmCollateral={setConfirmCollateral}
      hasLunaOrUstCollateralEnabled={hasLunaOrUstCollateralEnabled}
      openLunaUstWarningModal={openLunaUstWarningModal}
    />
  );
};

export default SupplyMarket;
