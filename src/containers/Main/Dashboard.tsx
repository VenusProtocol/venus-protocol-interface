/* eslint-disable no-useless-escape */
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'styl... Remove this comment to see the full error message
import styled from 'styled-components';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reco... Remove this comment to see the full error message
import { compose } from 'recompose';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
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

export default compose(
  withRouter,
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 0-1 arguments, but got 2.
  connectAccount(mapStateToProps, mapDispatchToProps)
)(Dashboard);
