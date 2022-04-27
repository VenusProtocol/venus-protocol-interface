/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { Paper } from '@mui/material';
import { Asset } from 'types';
import { ToastError } from 'utilities/errors';
import toast from 'components/Basic/Toast';
import { useExitMarket, useEnterMarkets } from 'clients/api';
import { useTranslation } from 'translation';
import { Delimiter } from 'components';
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
  toggleAssetCollateral: (a: Asset) => void;
  confirmCollateral: Asset | undefined;
  setConfirmCollateral: (asset: Asset | undefined) => void;
}

export const SupplyMarketUi: React.FC<ISupplyMarketProps> = ({
  isXvsEnabled,
  supplyMarketAssets,
  suppliedAssets,
  toggleAssetCollateral,
  confirmCollateral,
  setConfirmCollateral,
  className,
}) => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>(undefined);
  const styles = useStyles();

  const collateralOnChange = async (asset: Asset) => {
    try {
      toggleAssetCollateral(asset);
    } catch (e) {
      if (e instanceof ToastError) {
        toast.error({
          title: e.title,
          description: e.description,
        });
      }
    }
  };
  return (
    <Paper className={className} css={styles.tableContainer}>
      {suppliedAssets.length > 0 && (
        <>
          <SuppliedTable
            isXvsEnabled={isXvsEnabled}
            assets={suppliedAssets}
            setSelectedAsset={setSelectedAsset}
            collateralOnChange={collateralOnChange}
          />
          <Delimiter css={styles.delimiter} />
        </>
      )}
      <SupplyMarketTable
        isXvsEnabled={isXvsEnabled}
        assets={supplyMarketAssets}
        setSelectedAsset={setSelectedAsset}
        collateralOnChange={collateralOnChange}
      />
      <CollateralConfirmModal
        asset={confirmCollateral}
        handleClose={() => setConfirmCollateral(undefined)}
      />
      {selectedAsset && (
        <SupplyWithdrawModal asset={selectedAsset} onClose={() => setSelectedAsset(undefined)} />
      )}
    </Paper>
  );
};

const SupplyMarket: React.FC<
  Pick<ISupplyMarketProps, 'isXvsEnabled' | 'supplyMarketAssets' | 'suppliedAssets'> & {
    accountAddress: string;
  }
> = ({ isXvsEnabled, supplyMarketAssets, suppliedAssets, accountAddress }) => {
  const [confirmCollateral, setConfirmCollateral] = useState<Asset | undefined>(undefined);
  const { t } = useTranslation();

  const { mutate: enterMarkets } = useEnterMarkets({
    onSuccess: () => setConfirmCollateral(undefined),
    onError: error => {
      setConfirmCollateral(undefined);
      throw error;
    },
  });
  const { mutate: exitMarkets } = useExitMarket({
    onSuccess: () => setConfirmCollateral(undefined),
    onError: error => {
      setConfirmCollateral(undefined);
      throw error;
    },
  });

  const toggleAssetCollateral = (asset: Asset) => {
    if (!accountAddress) {
      throw new ToastError(
        t('markets.errors.accountError.title'),
        t('markets.errors.accountError.description'),
      );
    } else if (!asset || !asset.borrowBalance.isZero()) {
      throw new ToastError(
        t('markets.errors.collateralRequired.title'),
        t('markets.errors.collateralRequired.description'),
      );
    } else if (!asset.collateral) {
      try {
        setConfirmCollateral(asset);
        enterMarkets({ vtokenAddresses: [asset.vtokenAddress], accountAddress });
      } catch (error) {
        throw new ToastError(
          t('markets.errors.collateralEnableError.title'),
          t('markets.errors.collateralEnableError.description', { assetName: asset.symbol }),
        );
      }
    } else if (+asset.hypotheticalLiquidity['1'] > 0 || +asset.hypotheticalLiquidity['2'] === 0) {
      try {
        setConfirmCollateral(asset);
        exitMarkets({ vtokenAddress: asset.vtokenAddress, accountAddress });
      } catch (error) {
        throw new ToastError(
          t('markets.errors.collateralDisableError.title'),
          t('markets.errors.collateralDisableError.description', { assetName: asset.symbol }),
        );
      }
    } else {
      throw new ToastError(
        t('markets.errors.collateralRequired.title'),
        t('markets.errors.collateralRequired.description'),
      );
    }
  };

  return (
    <SupplyMarketUi
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
