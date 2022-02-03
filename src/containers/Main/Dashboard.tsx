/* eslint-disable no-useless-escape */
import React from 'react';
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
import { Row, Column } from 'components/Basic/Style';

const DashboardWrapper = styled.div`
  height: 100%;
`;

function Dashboard() {
  return (
    <MainLayout title="Dashboard">
      <DashboardWrapper className="flex">
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
      </DashboardWrapper>
    </MainLayout>
  );
}

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
