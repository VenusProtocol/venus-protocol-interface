import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { Icon } from 'antd';
import { compose } from 'recompose';
import commaNumber from 'comma-number';
import { connectAccount } from 'core';
import { getComptrollerContract, methods } from 'utilities/ContractService';
import toast from 'components/Basic/Toast';
import { Label } from 'components/Basic/Label';
import CollateralConfirmModal from 'components/Basic/CollateralConfirmModal';
import Toggle from 'components/Basic/Toggle';
import SupplyModal from 'components/Basic/SupplyModal';
import MarketTable from 'components/Basic/Table';
import PendingTransaction from 'components/Basic/PendingTransaction';
import BigNumber from 'bignumber.js';

const SupplyMarketWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 6px;
`;

const format = commaNumber.bindWith(',', '.');

function SupplyMarket({ settings, suppliedAssets, remainAssets }) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenCollateralConfirm, setIsCollateralConfirm] = useState(false);
  const [record, setRecord] = useState({});
  const [isCollateralEnalbe, setIsCollateralEnable] = useState(true);

  const handleToggleCollateral = r => {
    const appContract = getComptrollerContract();
    if (r && settings.selectedAddress && r.borrowBalance.isZero()) {
      if (!r.collateral) {
        setIsCollateralEnable(false);
        setIsCollateralConfirm(true);
        methods
          .send(
            appContract.methods.enterMarkets,
            [[r.vtokenAddress]],
            settings.selectedAddress
          )
          .then(() => {
            setIsCollateralConfirm(false);
          })
          .catch(() => {
            setIsCollateralConfirm(false);
          });
      } else if (
        +r.hypotheticalLiquidity['1'] > 0 ||
        +r.hypotheticalLiquidity['2'] === 0
      ) {
        setIsCollateralEnable(true);
        setIsCollateralConfirm(true);
        methods
          .send(
            appContract.methods.exitMarket,
            [r.vtokenAddress],
            settings.selectedAddress
          )
          .then(() => {
            setIsCollateralConfirm(false);
          })
          .catch(() => {
            setIsCollateralConfirm(false);
          });
      } else {
        toast.error({
          title: `Collateral Required`,
          description:
            'You need to set collateral at least one asset for your borrowed assets. Please repay all borrowed asset or set other asset as collateral.'
        });
      }
    } else {
      toast.error({
        title: `Collateral Required`,
        description:
          'You need to set collateral at least one asset for your borrowed assets. Please repay all borrowed asset or set other asset as collateral.'
      });
    }
  };

  const supplyColumns = [
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'asset',
      render(img, asset) {
        return {
          children: (
            <div className="flex align-center">
              <img src={asset.img} alt="ethereum" />
              <div className="flex flex-column align-start">
                <Label size="14" primary>
                  {asset.name}
                </Label>
                <Label size="14">
                  {asset.supplyApy.dp(2, 1).toString(10)}%
                </Label>
              </div>
            </div>
          )
        };
      }
    },
    {
      title: 'APY',
      dataIndex: 'supplyApy',
      key: 'supplyApy',
      render(supplyApy, asset) {
        const apy = settings.withXVS
          ? supplyApy.plus(asset.xvsSupplyApy)
          : supplyApy;

        return {
          children: (
            <div className="apy-content">
              <Icon type="arrow-up" />
              <div className="apy-green-label">
                {new BigNumber(apy).isGreaterThan(100000000)
                  ? 'Infinity'
                  : `${apy.dp(2, 1).toString(10)}%`}
              </div>
            </div>
          )
        };
      }
    },
    {
      title: 'Wallet',
      dataIndex: 'walletBalance',
      key: 'walletBalance',
      render(walletBalance, asset) {
        return {
          children: (
            <Label size="14" primary>
              {format(walletBalance.dp(2, 1).toString(10))} {asset.symbol}
            </Label>
          )
        };
      }
    },
    {
      title: 'Collateral',
      dataIndex: 'collateral',
      key: 'collateral',
      render(collateral, asset) {
        return {
          children: +asset.collateralFactor.toString() ? (
            <Toggle
              checked={collateral}
              onChecked={() => handleToggleCollateral(asset)}
            />
          ) : null
        };
      }
    }
  ];

  const suppliedColumns = [
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'asset',
      render(img, asset) {
        return {
          children: (
            <div className="flex align-center">
              <img src={asset.img} alt="ethereum" />
              <div className="flex flex-column align-start">
                <Label size="14" primary>
                  {asset.name}
                </Label>
                <Label size="14">
                  {asset.supplyApy.dp(2, 1).toString(10)}%
                </Label>
              </div>
            </div>
          )
        };
      }
    },
    {
      title: 'APY / Earned',
      dataIndex: 'supplyApy',
      key: 'supplyApy',
      render(supplyApy, asset) {
        const apy = settings.withXVS
          ? supplyApy.plus(asset.xvsSupplyApy)
          : supplyApy;
        return {
          children: (
            <div className="apy-content">
              <Icon type="arrow-up" />
              <div className="apy-green-label">
                {new BigNumber(apy).isGreaterThan(100000000)
                  ? 'Infinity'
                  : `${apy.dp(2, 1).toString(10)}%`}
              </div>
            </div>
          )
        };
      }
    },
    {
      title: 'Balance',
      dataIndex: 'supplyBalance',
      key: 'supplyBalance',
      render(supplyBalance, asset) {
        return {
          children: (
            <div className="wallet-label flex flex-column">
              <Label size="14" primary>
                $
                {format(
                  supplyBalance
                    .times(asset.tokenPrice)
                    .dp(2, 1)
                    .toString(10)
                )}
              </Label>
              <Label size="14">
                {format(supplyBalance.dp(4, 1).toString(10))} {asset.symbol}
              </Label>
            </div>
          )
        };
      }
    },
    {
      title: 'Collateral',
      dataIndex: 'collateral',
      key: 'collateral',
      render(collateral, asset) {
        return {
          children: +asset.collateralFactor ? (
            <Toggle
              checked={collateral}
              onChecked={() => handleToggleCollateral(asset)}
            />
          ) : null
        };
      }
    }
  ];

  const handleClickRow = row => {
    setRecord(row);
    setIsOpenModal(true);
  };
  return (
    <SupplyMarketWrapper>
      {suppliedAssets.length === 0 && remainAssets.length === 0 && (
        <LoadingSpinner />
      )}
      {suppliedAssets.length > 0 && (
        <MarketTable
          columns={suppliedColumns}
          data={suppliedAssets}
          title="Supply"
          handleClickRow={handleClickRow}
        />
      )}
      {settings.pendingInfo &&
        settings.pendingInfo.status &&
        ['Supply', 'Withdraw'].includes(settings.pendingInfo.type) && (
          <PendingTransaction />
        )}
      {remainAssets.length > 0 && (
        <MarketTable
          columns={supplyColumns}
          data={remainAssets}
          title="All Markets"
          handleClickRow={handleClickRow}
        />
      )}
      <SupplyModal
        visible={isOpenModal}
        asset={record}
        onCancel={() => setIsOpenModal(false)}
      />
      <CollateralConfirmModal
        visible={isOpenCollateralConfirm}
        isCollateralEnalbe={isCollateralEnalbe}
        onCancel={() => setIsCollateralConfirm(false)}
      />
    </SupplyMarketWrapper>
  );
}

SupplyMarket.propTypes = {
  suppliedAssets: PropTypes.array,
  remainAssets: PropTypes.array,
  settings: PropTypes.object
};

SupplyMarket.defaultProps = {
  suppliedAssets: [],
  remainAssets: [],
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(connectAccount(mapStateToProps, undefined))(
  SupplyMarket
);
