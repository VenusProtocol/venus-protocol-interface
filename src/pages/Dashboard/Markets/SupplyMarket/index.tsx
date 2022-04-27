/** @jsxImportSource @emotion/react */
import React, { useContext, useMemo, useState } from 'react';
import { formatCoinsToReadableValue, formatApy } from 'utilities/common';
import { Asset, TokenId } from 'types';
import { switchAriaLabel, Token, Toggle } from 'components';
import { Table, ITableProps } from 'components/v2/Table';
import { ToastError } from 'utilities/errors';
import toast from 'components/Basic/Toast';
import { useUserMarketInfo, useExitMarket, useEnterMarkets } from 'clients/api';
import { useTranslation } from 'translation';
import { AuthContext } from 'context/AuthContext';
import { SupplyWithdrawModal } from '../../Modals';
import { CollateralConfirmModal } from './CollateralConfirmModal';
import { useStyles } from '../styles';

export interface ISupplyMarketUiProps {
  className?: string;
  assets: Asset[];
  isXvsEnabled: boolean;
  toggleAssetCollateral: (a: Asset) => void;
  confirmCollateral: Asset | undefined;
  setConfirmCollateral: (asset: Asset | undefined) => void;
}

export const SupplyMarketUi: React.FC<ISupplyMarketUiProps> = ({
  className,
  assets,
  toggleAssetCollateral,
  isXvsEnabled,
  confirmCollateral,
  setConfirmCollateral,
}) => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>(undefined);
  const styles = useStyles();
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      { key: 'asset', label: t('markets.columns.asset'), orderable: false },
      { key: 'apy', label: t('markets.columns.apy'), orderable: true },
      { key: 'wallet', label: t('markets.columns.wallet'), orderable: true },
      { key: 'collateral', label: t('markets.columns.collateral'), orderable: true },
    ],
    [],
  );

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
  // Format assets to rows
  const rows: ITableProps['data'] = assets.map(asset => [
    {
      key: 'asset',
      render: () => <Token symbol={asset.symbol as TokenId} />,
      value: asset.id,
    },
    {
      key: 'apy',
      render: () => {
        const apy = isXvsEnabled ? asset.xvsSupplyApy.plus(asset.supplyApy) : asset.supplyApy;
        return formatApy(apy);
      },
      value: asset.supplyApy.toString(),
    },
    {
      key: 'wallet',
      render: () =>
        formatCoinsToReadableValue({
          value: asset.walletBalance,
          tokenId: asset.id as TokenId,
        }),
      value: asset.walletBalance.toString(),
    },
    {
      key: asset.collateral.toString(),
      value: asset.collateral,
      render: () =>
        +asset.collateralFactor.toString() ? (
          <Toggle onChange={() => collateralOnChange(asset)} value={asset.collateral} />
        ) : null,
    },
  ]);
  const rowOnClick = (e: React.MouseEvent<HTMLElement>, row: ITableProps['data'][number]) => {
    if ((e.target as HTMLElement).ariaLabel !== switchAriaLabel) {
      const asset = assets.find((value: Asset) => value.id === row[0].value);
      if (asset) {
        setSelectedAsset(asset);
      }
    }
  };
  return (
    <div className={className} css={styles.tableContainer}>
      <Table
        title={t('markets.supplyMarketTableTitle')}
        columns={columns}
        data={rows}
        initialOrder={{
          orderBy: 'apy',
          orderDirection: 'asc',
        }}
        rowOnClick={rowOnClick}
        rowKeyIndex={0}
      />
      <CollateralConfirmModal
        asset={confirmCollateral}
        handleClose={() => setConfirmCollateral(undefined)}
      />
      {selectedAsset && (
        <SupplyWithdrawModal asset={selectedAsset} onClose={() => setSelectedAsset(undefined)} />
      )}
    </div>
  );
};

const SupplyMarket: React.FC<Pick<ISupplyMarketUiProps, 'isXvsEnabled'>> = ({ isXvsEnabled }) => {
  const { account } = useContext(AuthContext);
  const { assets } = useUserMarketInfo({ accountAddress: account?.address });
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
    if (!account) {
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
        enterMarkets({ vtokenAddresses: [asset.vtokenAddress], accountAddress: account.address });
      } catch (error) {
        throw new ToastError(
          t('markets.errors.collateralEnableError.title'),
          t('markets.errors.collateralEnableError.description', { assetName: asset.symbol }),
        );
      }
    } else if (+asset.hypotheticalLiquidity['1'] > 0 || +asset.hypotheticalLiquidity['2'] === 0) {
      try {
        setConfirmCollateral(asset);
        exitMarkets({ vtokenAddress: asset.vtokenAddress, accountAddress: account.address });
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
      assets={assets}
      isXvsEnabled={isXvsEnabled}
      toggleAssetCollateral={toggleAssetCollateral}
      confirmCollateral={confirmCollateral}
      setConfirmCollateral={setConfirmCollateral}
    />
  );
};

export default SupplyMarket;
