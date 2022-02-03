import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reco... Remove this comment to see the full error message
import { compose } from 'recompose';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'styl... Remove this comment to see the full error message
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import SupplyMarket from 'components/Dashboard/Market/SupplyMarket';
import BorrowMarket from 'components/Dashboard/Market/BorrowMarket';
import { Card } from 'components/Basic/Card';
import MintTab from 'components/Basic/VaiTabs/MintTab';
import RepayVaiTab from 'components/Basic/VaiTabs/RepayVaiTab';
import { getBigNumber } from 'utilities/common';
import { useMarketsUser } from '../../hooks/useMarketsUser';

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


const Market = ({ settings, setSetting }: $TSFixMe) => {
  const [currentTab, setCurrentTab] = useState('supply');
  const [suppliedAssets, setSuppliedAssets] = useState([]);
  const [nonSuppliedAssets, setNonSuppliedAssets] = useState([]);
  const [borrowedAssets, setBorrowedAssets] = useState([]);
  const [nonBorrowedAssets, setNonBorrowedAssets] = useState([]);
  const { userMarketInfo } = useMarketsUser();

  const updateMarketTable = () => {
    
    const tempSuppliedData: $TSFixMe = [];
    
    const tempNonSuppliableData: $TSFixMe = [];
    
    const tempBorrowedData: $TSFixMe = [];
    
    const tempNonBorrowedData: $TSFixMe = [];
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'forEach' does not exist on type '{}'.
    userMarketInfo.forEach((element: $TSFixMe) => {
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
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'any[]' is not assignable to para... Remove this comment to see the full error message
    setSuppliedAssets([...tempSuppliedData]);
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'any[]' is not assignable to para... Remove this comment to see the full error message
    setNonSuppliedAssets([...tempNonSuppliableData]);
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'any[]' is not assignable to para... Remove this comment to see the full error message
    setBorrowedAssets([...tempBorrowedData]);
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'any[]' is not assignable to para... Remove this comment to see the full error message
    setNonBorrowedAssets([...tempNonBorrowedData]);
  };

  useEffect(() => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'length' does not exist on type '{}'.
    if (userMarketInfo && userMarketInfo.length > 0) {
      updateMarketTable();
    }
  }, [userMarketInfo]);

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


const mapStateToProps = ({ account }: $TSFixMe) => ({
  settings: account.setting
});


const mapDispatchToProps = (dispatch: $TSFixMe) => {
  const { setSetting } = accountActionCreators;

  return bindActionCreators(
    {
      setSetting
    },
    dispatch
  );
};

// @ts-expect-error ts-migrate(2554) FIXME: Expected 0-1 arguments, but got 2.
export default compose(connectAccount(mapStateToProps, mapDispatchToProps))(
  Market
);
