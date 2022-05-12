/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { Paper } from '@mui/material';
import { Asset, TokenId } from 'types';
import { UiError } from 'utilities/errors';
import toast from 'components/Basic/Toast';
import { useExitMarket, useEnterMarkets } from 'clients/api';
import { useTranslation } from 'translation';
import { switchAriaLabel, Delimiter, ITableProps } from 'components';
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
      toggleAssetCollateral(asset);
    } catch (e) {
      if (e instanceof UiError) {
        toast.error({
          title: e.title,
          description: e.description,
        });
      }
    }
  };

  const rowOnClick = (e: React.MouseEvent<HTMLElement>, row: ITableProps['data'][number]) => {
    if ((e.target as HTMLElement).ariaLabel !== switchAriaLabel) {
      setSelectedAssetId(row[0].value as TokenId);
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
        hasSuppliedAssets={suppliedAssets.length > 0}
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
      throw new UiError(
        t('markets.errors.accountError.title'),
        t('markets.errors.accountError.description'),
      );
    } else if (!asset || !asset.borrowBalance.isZero()) {
      throw new UiError(
        t('markets.errors.collateralRequired.title'),
        t('markets.errors.collateralRequired.description'),
      );
    } else if (!asset.collateral) {
      try {
        setConfirmCollateral(asset);
        enterMarkets({ vtokenAddresses: [asset.vtokenAddress], accountAddress });
      } catch (error) {
        throw new UiError(
          t('markets.errors.collateralEnableError.title'),
          t('markets.errors.collateralEnableError.description', { assetName: asset.symbol }),
        );
      }
    } else if (+asset.hypotheticalLiquidity['1'] > 0 || +asset.hypotheticalLiquidity['2'] === 0) {
      try {
        setConfirmCollateral(asset);
        exitMarkets({ vtokenAddress: asset.vtokenAddress, accountAddress });
      } catch (error) {
        throw new UiError(
          t('markets.errors.collateralDisableError.title'),
          t('markets.errors.collateralDisableError.description', { assetName: asset.symbol }),
        );
      }
    } else {
      throw new UiError(
        t('markets.errors.collateralRequired.title'),
        t('markets.errors.collateralRequired.description'),
      );
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
