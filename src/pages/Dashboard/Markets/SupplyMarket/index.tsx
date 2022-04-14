/** @jsxImportSource @emotion/react */
import React, { useMemo, useState } from 'react';
import { formatCoinsToReadableValue, formatApy } from 'utilities/common';
import { Asset, TokenSymbol } from 'types';
import { Token, Toggle } from 'components';
import { Table, ITableProps } from 'components/v2/Table';
import { ToastError } from 'utilities/errors';
import toast from 'components/Basic/Toast';
import { useWeb3Account } from 'clients/web3';
import useUserMarketInfo from 'hooks/useUserMarketInfo';
import { useExitMarket, useEnterMarkets } from 'clients/api';
import { useTranslation } from 'translation';
import { CollateralConfirmModal } from './CollateralConfirmModal';
import { useStyles } from '../styles';

export interface ISupplyMarketUiProps {
  className?: string;
  assets: Asset[];
  withXvs: boolean;
  toggleAssetCollateral: (a: Asset) => void;
  confirmCollateral: Asset | undefined;
  setConfirmCollateral: (asset: Asset | undefined) => void;
}

export const SupplyMarketUi: React.FC<ISupplyMarketUiProps> = ({
  className,
  assets,
  toggleAssetCollateral,
  withXvs,
  confirmCollateral,
  setConfirmCollateral,
}) => {
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
      render: () => <Token symbol={asset.name as TokenSymbol} />,
      value: asset.name,
    },
    {
      key: 'apy',
      render: () => {
        const apy = withXvs ? asset.xvsBorrowApy.plus(asset.borrowApy) : asset.borrowApy;
        return formatApy(apy);
      },
      value: asset.borrowApy.toString(),
    },
    {
      key: 'wallet',
      render: () =>
        formatCoinsToReadableValue({
          value: asset.walletBalance,
          tokenSymbol: asset.symbol as TokenSymbol,
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
  const rowOnClick = () => {
    // @TODO - Sprint 10 https://app.clickup.com/t/24quh87
    console.log('To be implemented in Sprint 10');
  };
  return (
    <div className={className} css={styles.tableContainer}>
      <Table
        title={t('markets.tableTitle')}
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
    </div>
  );
};

const SupplyMarket: React.FC = () => {
  const { account = '' } = useWeb3Account();
  const userMarketInfo = useUserMarketInfo({ account });
  const [confirmCollateral, setConfirmCollateral] = useState<Asset | undefined>(undefined);
  const { t } = useTranslation();

  const { mutate: enterMarkets } = useEnterMarkets({
    onSuccess: () => {
      setConfirmCollateral(undefined);
    },
    onError: error => {
      setConfirmCollateral(undefined);
      throw error;
    },
  });
  const { mutate: exitMarkets } = useExitMarket({
    onSuccess: () => {
      setConfirmCollateral(undefined);
    },
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
        enterMarkets({ vtokenAddresses: [asset.vtokenAddress], account });
      } catch (error) {
        throw new ToastError(
          t('markets.errors.collateralEnableError.title'),
          t('markets.errors.collateralEnableError.description', { assetName: asset.name }),
        );
      }
    } else if (+asset.hypotheticalLiquidity['1'] > 0 || +asset.hypotheticalLiquidity['2'] === 0) {
      try {
        setConfirmCollateral(asset);
        exitMarkets({ vtokenAddress: asset.vtokenAddress, account });
      } catch (error) {
        throw new ToastError(
          t('markets.errors.collateralDisableError.title'),
          t('markets.errors.collateralDisableError.description', { assetName: asset.name }),
        );
      }
    } else {
      throw new ToastError(
        t('markets.errors.collateralRequired.title'),
        t('markets.errors.collateralRequired.description'),
      );
    }
  };
  // @TODO: set withXVS from WalletBalance
  return (
    <SupplyMarketUi
      assets={userMarketInfo}
      withXvs
      toggleAssetCollateral={toggleAssetCollateral}
      confirmCollateral={confirmCollateral}
      setConfirmCollateral={setConfirmCollateral}
    />
  );
};

export default SupplyMarket;
