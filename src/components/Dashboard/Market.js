import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import SupplyMarket from 'components/Dashboard/Market/SupplyMarket';
import BorrowMarket from 'components/Dashboard/Market/BorrowMarket';
import { Card } from 'components/Basic/Card';
import MintTab from 'components/Basic/VaiTabs/MintTab';
import RepayVaiTab from 'components/Basic/VaiTabs/RepayVaiTab';
import { getBigNumber } from 'utilities/common';

const CardWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 25px;
  background-color: var(--color-bg-primary);
  padding: 15px 14px;
`;

const Tabs = styled.div`
  display: flex;
  align-items: center;
  .tab-item {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 199px;
    height: 41px;
    color: var(--color-text-inactive);
  }
  .tab-active {
    border-radius: 3px;
    font-weight: 600;
    color: var(--color-text-main);
    background-color: var(--color-bg-active);
  }
`;

const TabContent = styled.div`
  width: 100%;
  height: calc(100% - 75px);
  margin-top: 35px;
  display: flex;
  justify-content: center;
`;

const MintRepayVai = styled.div`
  @media only screen and (max-width: 1300px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const Market = ({ settings, setSetting }) => {
  const [currentTab, setCurrentTab] = useState('supply');
  const [suppliedAssets, setSuppliedAssets] = useState([]);
  const [nonSuppliedAssets, setNonSuppliedAssets] = useState([]);
  const [borrowedAssets, setBorrowedAssets] = useState([]);
  const [nonBorrowedAssets, setNonBorrowedAssets] = useState([]);

  const updateMarketTable = async () => {
    const tempArr = [];
    settings.assetList.forEach(item => {
      const temp = {
        ...item,
        supplyApy: getBigNumber(item.supplyApy),
        borrowApy: getBigNumber(item.borrowApy),
        walletBalance: getBigNumber(item.walletBalance),
        supplyBalance: getBigNumber(item.supplyBalance),
        vTokenBalance: getBigNumber(item.vTokenBalance),
        borrowBalance: getBigNumber(item.borrowBalance),
        collateralFactor: getBigNumber(item.collateralFactor),
        tokenPrice: getBigNumber(item.tokenPrice),
        liquidity: getBigNumber(item.liquidity)
      };
      tempArr.push(temp);
    });

    const tempSuppliedData = [];
    const tempNonSuppliableData = [];
    const tempBorrowedData = [];
    const tempNonBorrowedData = [];
    tempArr.forEach(element => {
      if (element.supplyBalance.isZero()) {
        tempNonSuppliableData.push(element);
      } else {
        tempSuppliedData.push(element);
      }

      if (element.borrowBalance.isZero()) {
        tempNonBorrowedData.push(element);
      } else {
        tempBorrowedData.push(element);
      }
    });
    setSuppliedAssets([...tempSuppliedData]);
    setNonSuppliedAssets([...tempNonSuppliableData]);
    setBorrowedAssets([...tempBorrowedData]);
    setNonBorrowedAssets([...tempNonBorrowedData]);
  };

  useEffect(() => {
    if (settings.assetList && settings.assetList.length > 0) {
      updateMarketTable();
    }
  }, [settings.assetList]);

  useEffect(() => {
    if (currentTab !== 'vai') {
      setSetting({ marketType: currentTab });
    }
  }, [currentTab, setSetting]);

  return (
    <Card>
      <CardWrapper>
        <Tabs>
          <div
            className={`tab-item center ${
              currentTab === 'supply' ? 'tab-active' : ''
            }`}
            onClick={() => {
              setCurrentTab('supply');
            }}
          >
            Supply Market
          </div>
          <div
            className={`tab-item center ${
              currentTab === 'borrow' ? 'tab-active' : ''
            }`}
            onClick={() => {
              setCurrentTab('borrow');
            }}
          >
            Borrow Market
          </div>
          <div
            className={`tab-item center ${
              currentTab === 'vai' ? 'tab-active' : ''
            }`}
            onClick={() => {
              setCurrentTab('vai');
            }}
          >
            Mint / Repay VAI
          </div>
        </Tabs>
        <TabContent>
          {currentTab === 'supply' && (
            <SupplyMarket
              suppliedAssets={suppliedAssets}
              remainAssets={nonSuppliedAssets}
            />
          )}
          {currentTab === 'borrow' && (
            <BorrowMarket
              borrowedAssets={borrowedAssets}
              remainAssets={nonBorrowedAssets}
            />
          )}
          {currentTab === 'vai' && (
            <MintRepayVai className="flex align-center">
              <MintTab />
              <RepayVaiTab />
            </MintRepayVai>
          )}
        </TabContent>
      </CardWrapper>
    </Card>
  );
};

Market.propTypes = {
  settings: PropTypes.object,
  setSetting: PropTypes.func.isRequired
};

Market.defaultProps = {
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

const mapDispatchToProps = dispatch => {
  const { setSetting } = accountActionCreators;

  return bindActionCreators(
    {
      setSetting
    },
    dispatch
  );
};

export default compose(connectAccount(mapStateToProps, mapDispatchToProps))(
  Market
);
