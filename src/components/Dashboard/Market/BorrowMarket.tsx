import React, { useState } from 'react';
import styled from 'styled-components';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { Icon } from 'antd';
import { compose } from 'recompose';
import { connectAccount } from 'core';
import commaNumber from 'comma-number';
import { Label } from 'components/Basic/Label';
import BorrowModal from 'components/Basic/BorrowModal';
import MarketTable from 'components/Basic/Table';
import PendingTransaction from 'components/Basic/PendingTransaction';
import { getBigNumber, formatApy } from 'utilities/common';
import { Asset, Setting } from 'types';

const BorrowMarketWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 6px;
`;

const format = commaNumber.bindWith(',', '.');

interface DispatchProps {
  settings: Setting,
}

interface Props {
  borrowedAssets: Asset[],
  remainAssets: Asset[],
}

function BorrowMarket({ borrowedAssets, remainAssets, settings }: Props & DispatchProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [record, setRecord] = useState({});

  const handleClickRow = (row: $TSFixMe) => {
    setRecord(row);
    setIsOpenModal(true);
  };

  const remainColumns = [
    {
      title: 'Asset',
      dataIndex: 'img',
      key: 'img',

      render(img: $TSFixMe, asset: $TSFixMe) {
        return {
          children: (
            <div className="flex align-center">
              <img src={asset.img} alt="ethereum" />
              <div className="flex flex-column align-start">
                <Label size="14" primary>
                  {asset.name}
                </Label>
                <Label size="14">
                  {asset.borrowApy.dp(2, 1).toString(10)}
                  %
                </Label>
              </div>
            </div>
          ),
        };
      },
    },
    {
      title: 'APY',
      dataIndex: 'borrowApy',
      key: 'borrowApy',

      render(borrowApy: $TSFixMe, asset: $TSFixMe) {
        const apy = settings.withXVS
          ? getBigNumber(asset.xvsBorrowApy).plus(borrowApy)
          : borrowApy;
        return {
          children: (
            <div className="apy-content">
              {!settings.withXVS || apy.isNegative() ? (
                <Icon type="arrow-down" style={{ color: '#f9053e' }} />
              ) : (
                <Icon type="arrow-up" />
              )}
              <div
                className={
                  !settings.withXVS || apy.isNegative()
                    ? 'apy-red-label'
                    : 'apy-green-label'
                }
              >
                {formatApy(apy)}
              </div>
            </div>
          ),
        };
      },
    },
    {
      title: 'Wallet',
      dataIndex: 'walletBalance',
      key: 'walletBalance',

      render(walletBalance: $TSFixMe, asset: $TSFixMe) {
        return {
          children: (
            <Label size="14" primary>
              {format(walletBalance.dp(2, 1).toString(10))}
              {' '}
              {asset.symbol}
            </Label>
          ),
        };
      },
    },
    {
      title: 'Liquidity',
      dataIndex: 'liquidity',
      key: 'liquidity',

      render(liquidity: $TSFixMe) {
        return {
          children: (
            <Label size="14" primary>
              $
              {format(liquidity.dp(2, 1).toString(10))}
            </Label>
          ),
        };
      },
    },
  ];

  const borrowColumns = [
    {
      title: 'Asset',
      dataIndex: 'img',
      key: 'img',

      render(img: $TSFixMe, asset: $TSFixMe) {
        return {
          children: (
            <div className="flex align-center">
              <img src={asset.img} alt="ethereum" />
              <div className="flex flex-column align-start">
                <Label size="14" primary>
                  {asset.name}
                </Label>
                <Label size="14">
                  {asset.borrowApy.dp(2, 1).toString(10)}
                  %
                </Label>
              </div>
            </div>
          ),
        };
      },
    },
    {
      title: 'APY / Accrued',
      dataIndex: 'borrowApy',
      key: 'borrowApy',

      render(borrowApy: $TSFixMe, asset: $TSFixMe) {
        const apy = settings.withXVS
          ? getBigNumber(asset.xvsBorrowApy).plus(borrowApy)
          : borrowApy;
        return {
          children: (
            <div className="apy-content">
              {!settings.withXVS || apy.isNegative() ? (
                <Icon type="arrow-down" style={{ color: '#f9053e' }} />
              ) : (
                <Icon type="arrow-up" />
              )}
              <div
                className={
                  !settings.withXVS || apy.isNegative()
                    ? 'apy-red-label'
                    : 'apy-green-label'
                }
              >
                {formatApy(apy)}
              </div>
            </div>
          ),
        };
      },
    },
    {
      title: 'Balance',
      dataIndex: 'borrowBalance',
      key: 'borrowBalance',

      render(borrowBalance: $TSFixMe, asset: $TSFixMe) {
        return {
          children: (
            <div className="wallet-label flex flex-column">
              <Label size="14" primary>
                $
                {format(
                  borrowBalance
                    .times(asset.tokenPrice)
                    .dp(2, 1)
                    .toString(10),
                )}
              </Label>
              <Label size="14">
                {format(borrowBalance.dp(4, 1).toString(10))}
                {' '}
                {asset.symbol}
              </Label>
            </div>
          ),
        };
      },
    },
    {
      title: '% Of Limit',
      dataIndex: 'percentOfLimit',
      key: 'percentOfLimit',

      render(percentOfLimit: $TSFixMe) {
        const children = (
          <Label size="14">
            {percentOfLimit}
            %
          </Label>
        );
        return {
          children,
        };
      },
    },
  ];

  return (
    <BorrowMarketWrapper>
      {borrowedAssets.length === 0 && remainAssets.length === 0 && (
        <LoadingSpinner />
      )}
      {borrowedAssets.length > 0 && (
        <MarketTable
          columns={borrowColumns}
          data={borrowedAssets}
          title="Borrowing"
          handleClickRow={handleClickRow}
        />
      )}
      {settings.pendingInfo
        && settings.pendingInfo.status
        && ['Borrow', 'Repay Borrow'].includes(settings.pendingInfo.type) && (
          <PendingTransaction />
      )}
      {remainAssets.length > 0 && (
        <MarketTable
          columns={remainColumns}
          data={remainAssets}
          title="All Markets"
          handleClickRow={handleClickRow}
        />
      )}
      <BorrowModal
        visible={isOpenModal}
        // @ts-expect-error This is set as an empty object in state
        asset={record}
        onCancel={() => setIsOpenModal(false)}
      />
    </BorrowMarketWrapper>
  );
}

BorrowMarket.defaultProps = {
  borrowedAssets: [],
  remainAssets: [],
};

const mapStateToProps = ({ account }: $TSFixMe) => ({
  settings: account.setting,
});

// @ts-expect-error ts-migrate(2554) FIXME: Expected 0-1 arguments, but got 2.
export default compose<Props & DispatchProps, Props>(connectAccount(mapStateToProps, undefined))(
  BorrowMarket,
);
