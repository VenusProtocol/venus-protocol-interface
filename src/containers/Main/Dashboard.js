/* eslint-disable no-useless-escape */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import MainLayout from 'containers/Layout/MainLayout';
import CoinInfo from 'components/Dashboard/CoinInfo';
import VaiInfo from 'components/Dashboard/VaiInfo';
import BorrowLimit from 'components/Dashboard/BorrowLimit';
import Overview from 'components/Dashboard/Overview';
import WalletBalance from 'components/Dashboard/WalletBalance';
import Market from 'components/Dashboard/Market';
import { connectAccount, accountActionCreators } from 'core';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { Row, Column } from 'components/Basic/Style';
import {
  getTokenContract,
  getVbepContract,
  getComptrollerContract,
  getVaiControllerContract,
  getVaiTokenContract,
  methods
} from 'utilities/ContractService';
import BigNumber from 'bignumber.js';
import * as constants from 'utilities/constants';
import { getWeb3 } from 'utilities/ContractService';
import { useWeb3React } from '@web3-react/core';
import { useMarkets } from '../../hooks/useMarkets';
import { useVaiUser } from '../../hooks/useVaiUser';
import { useMarketsUser } from '../../hooks/useMarketsUser';

const DashboardWrapper = styled.div`
  height: 100%;
`;

const SpinnerWrapper = styled.div`
  height: 85vh;
  width: 100%;

  @media only screen and (max-width: 1440px) {
    height: 70vh;
  }
`;

function Dashboard({ settings, setSetting }) {
  const { account } = useWeb3React();

  return (
    <MainLayout title="Dashboard">
      <DashboardWrapper className="flex">
        {(!account || settings.accountLoading || settings.wrongNetwork) && (
          <SpinnerWrapper>
            <LoadingSpinner />
          </SpinnerWrapper>
        )}
        {account && !settings.accountLoading && !settings.wrongNetwork && (
          <Row>
            <Column xs="12" sm="12" md="5">
              <Row>
                <Column xs="12">
                  <CoinInfo />
                </Column>
                <Column xs="12">
                  <VaiInfo />
                </Column>
                <Column xs="12">
                  <BorrowLimit />
                </Column>
                <Column xs="12">
                  <Overview />
                </Column>
              </Row>
            </Column>
            <Column xs="12" sm="12" md="7">
              <Row>
                <Column xs="12">
                  <WalletBalance />
                </Column>
                <Column xs="12">
                  <Market />
                </Column>
              </Row>
            </Column>
          </Row>
        )}
      </DashboardWrapper>
    </MainLayout>
  );
}

Dashboard.propTypes = {
  settings: PropTypes.object,
  setSetting: PropTypes.func.isRequired
};

Dashboard.defaultProps = {
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

export default compose(
  withRouter,
  connectAccount(mapStateToProps, mapDispatchToProps)
)(Dashboard);
