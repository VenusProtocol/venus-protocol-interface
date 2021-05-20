/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import BigNumber from 'bignumber.js';
import * as constants from 'utilities/constants';
import MainLayout from 'containers/Layout/MainLayout';
import TotalInfo from 'components/Vault/TotalInfo';
import UserInfo from 'components/Vault/UserInfo';
import Staking from 'components/Vault/Staking';
import { connectAccount, accountActionCreators } from 'core';
import {
  getVaiTokenContract,
  getComptrollerContract,
  getVaiVaultContract,
  getTokenContract,
  methods
} from 'utilities/ContractService';
import { checkIsValidNetwork } from 'utilities/common';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { Row, Column } from 'components/Basic/Style';

const MarketWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VaultWrapper = styled.div`
  padding-top: 30px;
  height: 100%;
  position: relative;
  width: 100%;
  max-width: 1200px;
`;

const SpinnerWrapper = styled.div`
  height: 80vh;
  width: 100%;

  @media only screen and (max-width: 1440px) {
    height: 70vh;
  }
`;

function Vault({ settings }) {
  const [emission, setEmission] = useState('0');
  const [pendingRewards, setPendingRewards] = useState('0');
  const [availableVai, setAvailableVai] = useState(new BigNumber(0));
  const [vaiStaked, setVaiStaked] = useState(new BigNumber(0));
  const [vaiReward, setVaiReward] = useState('0');
  const [isEnabled, setIsEnabled] = useState(false);

  const updateTotalInfo = async () => {
    const compContract = getComptrollerContract();
    const xvsTokenContract = getTokenContract('xvs');
    const tokenContract = getVaiTokenContract();
    const vaultContract = getVaiVaultContract();

    const [
      venusVAIVaultRate,
      pendingRewards,
      availableAmount,
      { 0: staked },
      vaiReward,
      allowBalance
    ] = await Promise.all([
      methods.call(compContract.methods.venusVAIVaultRate, []),
      methods.call(xvsTokenContract.methods.balanceOf, [
        constants.CONTRACT_VAI_VAULT_ADDRESS
      ]),
      methods.call(tokenContract.methods.balanceOf, [settings.selectedAddress]),
      methods.call(vaultContract.methods.userInfo, [settings.selectedAddress]),
      methods.call(vaultContract.methods.pendingXVS, [
        settings.selectedAddress
      ]),
      methods.call(tokenContract.methods.allowance, [
        settings.selectedAddress,
        constants.CONTRACT_VAI_VAULT_ADDRESS
      ])
    ]);

    // total info
    setEmission(
      new BigNumber(venusVAIVaultRate)
        .div(1e18)
        .times(20 * 60 * 24)
        .dp(2, 1)
        .toString(10)
    );
    setPendingRewards(
      new BigNumber(pendingRewards)
        .div(1e18)
        .dp(4, 1)
        .toString(10)
    );
    setAvailableVai(new BigNumber(availableAmount).div(1e18));
    setVaiStaked(new BigNumber(staked).div(1e18));
    setVaiReward(
      new BigNumber(vaiReward)
        .div(1e18)
        .dp(4, 1)
        .toString(10)
    );
    setIsEnabled(new BigNumber(allowBalance).div(1e18).gt(availableAmount));
  };

  useEffect(() => {
    if (checkIsValidNetwork()) {
      updateTotalInfo();
    }
  }, [settings.markets]);

  return (
    <MainLayout title="Vault">
      <MarketWrapper>
        <VaultWrapper className="flex">
          {!settings.selectedAddress ? (
            <SpinnerWrapper>
              <LoadingSpinner />
            </SpinnerWrapper>
          ) : (
            <Row>
              <Column xs="12">
                <TotalInfo
                  emission={emission}
                  pendingRewards={pendingRewards}
                />
              </Column>
              <Column xs="12">
                <Row>
                  <Column xs="12" sm="12" md="5">
                    <UserInfo
                      availableVai={availableVai}
                      vaiStaked={vaiStaked}
                      vaiReward={vaiReward}
                    />
                  </Column>
                  <Column xs="12" sm="12" md="7">
                    <Staking
                      isEnabled={isEnabled}
                      availableVai={availableVai}
                      vaiStaked={vaiStaked}
                      updateTotalInfo={updateTotalInfo}
                    />
                  </Column>
                </Row>
              </Column>
            </Row>
          )}
        </VaultWrapper>
      </MarketWrapper>
    </MainLayout>
  );
}

Vault.propTypes = {
  settings: PropTypes.object
};

Vault.defaultProps = {
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
)(Vault);
