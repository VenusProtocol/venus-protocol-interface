/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { Paper } from '@mui/material';
import BigNumber from 'bignumber.js';
import { Asset, VTokenId } from 'types';
import { VError, formatVErrorToReadableString } from 'errors';
import { toast, switchAriaLabel, Delimiter, TableProps } from 'components';
import { useWeb3 } from 'clients/web3';
import { getVTokenContract, useComptrollerContract } from 'clients/contracts';
import {
  useExitMarket,
  useEnterMarkets,
  getHypotheticalAccountLiquidity,
  getVTokenBalanceOf,
} from 'clients/api';
import { SupplyWithdrawModal } from '../../Modals';
import { CollateralConfirmModal } from './CollateralConfirmModal';
import SupplyMarketTable from './SupplyMarketTable';
import SuppliedTable from './SuppliedTable';
import { useStyles } from '../styles';

interface ISupplyMarketProps {
  className?: string;
  isXvsEnabled: boolean;
  suppliedAssets: Asset[];
  supplyMarketAssets: Asset[];
  toggleAssetCollateral: (a: Asset) => Promise<void>;
  confirmCollateral: Asset | undefined;
  setConfirmCollateral: (asset: Asset | undefined) => void;
}

export const SupplyMarketUi: React.FC<ISupplyMarketProps> = ({
  className,
  isXvsEnabled,
  supplyMarketAssets,
  suppliedAssets,
  toggleAssetCollateral,
  confirmCollateral,
  setConfirmCollateral,
}) => {
  const [selectedAssetId, setSelectedAssetId] = React.useState<Asset['id'] | undefined>(undefined);
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
    if ((e.target as HTMLElement).ariaLabel !== switchAriaLabel) {
      setSelectedAssetId(row[0].value as VTokenId);
    }
  };

  const selectedAsset = React.useMemo(
    () =>
      [...supplyMarketAssets, ...suppliedAssets].find(
        marketAsset => marketAsset.id === selectedAssetId,
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
  Pick<ISupplyMarketProps, 'isXvsEnabled' | 'supplyMarketAssets' | 'suppliedAssets'> & {
    className?: string;
    accountAddress: string;
  }
> = ({ className, isXvsEnabled, supplyMarketAssets, suppliedAssets, accountAddress }) => {
  const web3 = useWeb3();
  const comptrollerContract = useComptrollerContract();

  const [confirmCollateral, setConfirmCollateral] = useState<Asset | undefined>(undefined);

  const { mutateAsync: enterMarkets } = useEnterMarkets({
    onSettled: () => setConfirmCollateral(undefined),
  });

  const { mutateAsync: exitMarkets } = useExitMarket({
    onSettled: () => setConfirmCollateral(undefined),
  });

  const toggleAssetCollateral = async (asset: Asset) => {
    if (!accountAddress) {
      throw new VError({
        type: 'interaction',
        code: 'accountError',
      });
    } else if (!asset || !asset.borrowBalance.isZero()) {
      throw new VError({
        type: 'interaction',
        code: 'collateralRequired',
      });
    } else if (!asset.collateral) {
      try {
        setConfirmCollateral(asset);
        await enterMarkets({ vtokenAddresses: [asset.vtokenAddress], accountAddress });
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

      return;
    }

    const vTokenContract = getVTokenContract(asset.id as VTokenId, web3);

    let assetHypotheticalLiquidity;
    try {
      const vTokenBalanceOf = await getVTokenBalanceOf({
        tokenContract: vTokenContract,
        account: accountAddress,
      });

      assetHypotheticalLiquidity = await getHypotheticalAccountLiquidity({
        comptrollerContract,
        accountAddress,
        vTokenAddress: asset.vtokenAddress,
        vTokenBalanceOfWei: new BigNumber(vTokenBalanceOf),
      });
    } catch (error) {
      if (error instanceof VError) {
        throw error;
      }
      throw new VError({
        type: 'interaction',
        code: 'collateralDisableError',
        data: { assetName: asset.symbol },
      });
    }

    if (+assetHypotheticalLiquidity['1'] > 0 || +assetHypotheticalLiquidity['2'] === 0) {
      try {
        setConfirmCollateral(asset);
        await exitMarkets({ vtokenAddress: asset.vtokenAddress, accountAddress });
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
      throw new VError({
        type: 'interaction',
        code: 'collateralRequired',
      });
    }
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
    />
  );
};

export default SupplyMarket;
