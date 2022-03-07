/* eslint-disable no-useless-escape */
import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MainLayout from 'containers/Layout/MainLayout';
import CoinInfo from 'components/Dashboard/CoinInfo';
import VaiInfo from 'components/Dashboard/VaiInfo';
import BorrowLimit from 'components/Dashboard/BorrowLimit';
import Overview from 'components/Dashboard/Overview';
import WalletBalance from 'components/Dashboard/WalletBalance';
import Market from 'components/Dashboard/Market';
import { Row, Column } from 'components/Basic/Style';
import { State } from 'core/modules/initialState';

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

const mapStateToProps = ({ account }: State) => ({
  settings: account.setting,
});

export default connect(mapStateToProps)(withRouter(Dashboard));
