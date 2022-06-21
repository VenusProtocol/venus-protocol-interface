/** @jsxImportSource @emotion/react */
import React, { useContext, useMemo } from 'react';

import { Typography } from '@mui/material';
import {
  useGetUserMarketInfo,
  useGetVenusVaiVaultDailyRateWei,
  useGetBalanceOf,
} from 'clients/api';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';
import { Token, Table, TableProps } from 'components';
import { AuthContext } from 'context/AuthContext';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import {
  getContractAddress,
  formatToReadablePercentage,
  formatTokensToReadableValue,
  convertWeiToTokens,
} from 'utilities';
import { useStyles } from '../styles';

type TableAsset = Pick<Asset, 'id' | 'symbol'> & {
  xvsPerDay: Asset['xvsPerDay'] | undefined;
  xvsSupplyApy: Asset['xvsSupplyApy'] | undefined;
  xvsBorrowApy: Asset['xvsBorrowApy'] | undefined;
};

interface IXvsTableProps {
  assets: TableAsset[];
}

const XvsTableUi: React.FC<IXvsTableProps> = ({ assets }) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const columns = useMemo(
    () => [
      { key: 'asset', label: t('xvs.columns.asset'), orderable: false, align: 'left' },
      { key: 'xvsPerDay', label: t('xvs.columns.xvsPerDay'), orderable: true, align: 'right' },
      {
        key: 'supplyXvsApy',
        label: t('xvs.columns.supplyXvsApy'),
        orderable: true,
        align: 'right',
      },
      {
        key: 'borrowXvsApy',
        label: t('xvs.columns.borrowXvsApy'),
        orderable: true,
        align: 'right',
      },
    ],
    [],
  );

  // Format assets to rows
  const rows: TableProps['data'] = assets.map(asset => [
    {
      key: 'asset',
      render: () => <Token tokenId={asset.id} />,
      value: asset.id,
      align: 'left',
    },
    {
      key: 'xvsPerDay',
      render: () => (
        <Typography variant="small1" css={[styles.whiteText, styles.fontWeight400]}>
          {formatTokensToReadableValue({
            value: asset.xvsPerDay,
            tokenId: 'xvs',
            minimizeDecimals: true,
          })}
        </Typography>
      ),
      value: asset.xvsPerDay?.toFixed() || 0,
      align: 'right',
    },
    {
      key: 'supplyXvsApy',
      render: () => (
        <Typography variant="small1" css={[styles.whiteText, styles.fontWeight400]}>
          {formatToReadablePercentage(asset.xvsSupplyApy)}
        </Typography>
      ),
      value: asset.xvsSupplyApy?.toFixed() || 0,
      align: 'right',
    },
    {
      key: 'borrowXvsApy',
      render: () => (
        <Typography variant="small1" css={[styles.whiteText, styles.fontWeight400]}>
          {formatToReadablePercentage(asset.xvsBorrowApy)}
        </Typography>
      ),
      value: asset.xvsBorrowApy?.toFixed() || 0,
      align: 'right',
    },
  ]);

  return (
    <Table
      columns={columns}
      data={rows}
      initialOrder={{
        orderBy: 'xvsPerDay',
        orderDirection: 'desc',
      }}
      rowKeyIndex={0}
      tableCss={styles.table}
      cardsCss={styles.cards}
      css={styles.cardContentGrid}
    />
  );
};

const XvsTable: React.FC = () => {
  const { account } = useContext(AuthContext);
  // TODO: handle loading state (see https://app.clickup.com/t/2d4rcee)
  const {
    data: { assets },
  } = useGetUserMarketInfo({
    accountAddress: account?.address,
  });

  const { data: venusVaiVaultDailyRateWei } = useGetVenusVaiVaultDailyRateWei();

  const { data: vaultVaiStakedWei } = useGetBalanceOf({
    tokenId: 'vai',
    accountAddress: getContractAddress('vaiVault'),
  });

  const assetsWithVai = useMemo(() => {
    const allAssets: TableAsset[] = [...assets];
    const xvsAsset = assets.find(asset => asset.id === 'xvs');

    if (venusVaiVaultDailyRateWei && vaultVaiStakedWei && xvsAsset) {
      const venusVaiVaultDailyRateTokens = convertWeiToTokens({
        valueWei: venusVaiVaultDailyRateWei,
        tokenId: 'xvs',
      });

      const vaultVaiStakedTokens = convertWeiToTokens({
        valueWei: vaultVaiStakedWei,
        tokenId: 'vai',
      });

      const vaiApy = venusVaiVaultDailyRateTokens
        .times(xvsAsset.tokenPrice)
        .times(DAYS_PER_YEAR)
        .times(100)
        .div(vaultVaiStakedTokens);

      allAssets.unshift({
        id: 'vai',
        symbol: 'VAI',
        xvsPerDay: venusVaiVaultDailyRateTokens,
        xvsSupplyApy: vaiApy,
        xvsBorrowApy: undefined,
      });
    }

    return allAssets;
  }, [JSON.stringify(assets), venusVaiVaultDailyRateWei?.toFixed(), vaultVaiStakedWei?.toFixed()]);

  return <XvsTableUi assets={assetsWithVai} />;
};

export default XvsTable;
