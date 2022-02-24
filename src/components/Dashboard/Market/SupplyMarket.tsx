import React, { useState } from 'react';
import styled from 'styled-components';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { Icon } from 'antd';
import commaNumber from 'comma-number';
import { connect } from 'react-redux';
import toast from 'components/Basic/Toast';
import { Label } from 'components/Basic/Label';
import CollateralConfirmModal from 'components/Basic/CollateralConfirmModal';
import Toggle from 'components/Basic/Toggle';
import SupplyModal from 'components/Basic/SupplyModal';
import MarketTable from 'components/Basic/Table';
import PendingTransaction from 'components/Basic/PendingTransaction';
import ga from 'clients/googleAnalytics';
import { formatApy } from 'utilities/common';
import { useWeb3React } from '@web3-react/core';
import { Asset, Setting } from 'types';
import { State } from 'core/modules/initialState';
import { useComptroller } from '../../../hooks/useContract';

const SupplyMarketWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 6px;
`;

const format = commaNumber.bindWith(',', '.');

interface StateProps {
  settings: Setting;
}
interface Props {
  suppliedAssets: Asset[];
  remainAssets: Asset[];
}

function SupplyMarket({ settings, suppliedAssets, remainAssets }: Props & StateProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenCollateralConfirm, setIsCollateralConfirm] = useState(false);
  const [record, setRecord] = useState({} as Asset);
  const [isCollateralEnalbe, setIsCollateralEnable] = useState(true);
  const { account } = useWeb3React();
  const comptrollerContract = useComptroller();

  const handleToggleCollateral = async (r: $TSFixMe) => {
    if (r && account && r.borrowBalance.isZero()) {
      if (!r.collateral) {
        setIsCollateralEnable(false);
        setIsCollateralConfirm(true);
        ga.buttonPressed('collateral_toggle', { status: 'enter', market: r.market });
        try {
          await comptrollerContract.methods.enterMarkets([r.vtokenAddress]).send({ from: account });
        } catch (error) {
          console.log('enter markets error :>> ', error);
        }
        setIsCollateralConfirm(false);
      } else if (+r.hypotheticalLiquidity['1'] > 0 || +r.hypotheticalLiquidity['2'] === 0) {
        ga.buttonPressed('collateral_toggle', { status: 'exit', market: r.market });
        setIsCollateralEnable(true);
        setIsCollateralConfirm(true);
        await comptrollerContract.methods.exitMarket(r.vtokenAddress).send({ from: account });
        setIsCollateralConfirm(false);
      } else {
        ga.error('collateral_toggle', { status: 'in_repayment', market: r.market });
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        toast.error({
          title: 'Collateral Required',
          description: 'Please repay all borrowed assets or set other assets as collateral.',
        });
      }
    } else {
      ga.error('collateral_toggle', { status: 'in_repayment', market: r.market });
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      toast.error({
        title: 'Collateral Required',
        description: 'Please repay all borrowed assets or set other assets as collateral.',
      });
    }
  };

  const supplyColumns = [
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'asset',

      render(img: $TSFixMe, asset: $TSFixMe) {
        return {
          children: (
            <div className="flex align-center">
              <img src={asset.img} alt="ethereum" />
              <div className="flex flex-column align-start">
                <Label size="14" primary>
                  {asset.name}
                </Label>
                <Label size="14">{asset.supplyApy.dp(2, 1).toString(10)}%</Label>
              </div>
            </div>
          ),
        };
      },
    },
    {
      title: 'APY',
      dataIndex: 'supplyApy',
      key: 'supplyApy',

      render(supplyApy: $TSFixMe, asset: $TSFixMe) {
        const apy = settings.withXVS ? supplyApy.plus(asset.xvsSupplyApy) : supplyApy;

        return {
          children: (
            <div className="apy-content">
              <Icon type="arrow-up" />
              <div className="apy-green-label">{formatApy(apy)}</div>
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
              {format(walletBalance.dp(2, 1).toString(10))} {asset.symbol}
            </Label>
          ),
        };
      },
    },
    {
      title: 'Collateral',
      dataIndex: 'collateral',
      key: 'collateral',

      render(collateral: $TSFixMe, asset: $TSFixMe) {
        return {
          children: +asset.collateralFactor.toString() ? (
            <Toggle checked={collateral} onChecked={() => handleToggleCollateral(asset)} />
          ) : null,
        };
      },
    },
  ];

  const suppliedColumns = [
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'asset',

      render(img: $TSFixMe, asset: $TSFixMe) {
        return {
          children: (
            <div className="flex align-center">
              <img src={asset.img} alt="ethereum" />
              <div className="flex flex-column align-start">
                <Label size="14" primary>
                  {asset.name}
                </Label>
                <Label size="14">{asset.supplyApy.dp(2, 1).toString(10)}%</Label>
              </div>
            </div>
          ),
        };
      },
    },
    {
      title: 'APY / Earned',
      dataIndex: 'supplyApy',
      key: 'supplyApy',

      render(supplyApy: $TSFixMe, asset: $TSFixMe) {
        const apy = settings.withXVS ? supplyApy.plus(asset.xvsSupplyApy) : supplyApy;
        return {
          children: (
            <div className="apy-content">
              <Icon type="arrow-up" />
              <div className="apy-green-label">{formatApy(apy)}</div>
            </div>
          ),
        };
      },
    },
    {
      title: 'Balance',
      dataIndex: 'supplyBalance',
      key: 'supplyBalance',

      render(supplyBalance: $TSFixMe, asset: $TSFixMe) {
        return {
          children: (
            <div className="wallet-label flex flex-column">
              <Label size="14" primary>
                $
                {format(
                  supplyBalance
                    .times(asset.tokenPrice)
                    .dp(2, 1)
                    .toString(10),
                )}
              </Label>
              <Label size="14">
                {format(supplyBalance.dp(4, 1).toString(10))} {asset.symbol}
              </Label>
            </div>
          ),
        };
      },
    },
    {
      title: 'Collateral',
      dataIndex: 'collateral',
      key: 'collateral',

      render(collateral: $TSFixMe, asset: $TSFixMe) {
        return {
          children: +asset.collateralFactor ? (
            <Toggle checked={collateral} onChecked={() => handleToggleCollateral(asset)} />
          ) : null,
        };
      },
    },
  ];

  const handleClickRow = (row: $TSFixMe) => {
    setRecord(row);
    setIsOpenModal(true);
  };
  return (
    <SupplyMarketWrapper>
      {suppliedAssets.length === 0 && remainAssets.length === 0 && <LoadingSpinner />}
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
        ['Supply', 'Withdraw'].includes(settings.pendingInfo.type) && <PendingTransaction />}
      {remainAssets.length > 0 && (
        <MarketTable
          columns={supplyColumns}
          data={remainAssets}
          title="All Markets"
          handleClickRow={handleClickRow}
        />
      )}
      <SupplyModal visible={isOpenModal} asset={record} onCancel={() => setIsOpenModal(false)} />
      <CollateralConfirmModal
        visible={isOpenCollateralConfirm}
        isCollateralEnalbe={isCollateralEnalbe}
        onCancel={() => setIsCollateralConfirm(false)}
      />
    </SupplyMarketWrapper>
  );
}
const mapStateToProps = ({ account }: State): StateProps => ({
  settings: account.setting,
});

export default connect(mapStateToProps)(SupplyMarket);
