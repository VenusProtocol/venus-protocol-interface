/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import BigNumber from 'bignumber.js';
import MainLayout from 'containers/Layout/MainLayout';
import VaiTotalInfo from 'components/Vault/VAI/TotalInfo';
import VaiStaking from 'components/Vault/VAI/Staking';
import XVSVault from 'components/Vault/XVS';
import TotalInfo from 'components/Vault/TotalInfo';
import UserInfo from 'components/Vault/UserInfo';
import Staking from 'components/Vault/Staking';
import { connectAccount, accountActionCreators } from 'core';
import { Row, Column } from 'components/Basic/Style';
import { useWeb3React } from '@web3-react/core';
import useRefresh from '../../hooks/useRefresh';
import {
  useComptroller,
  useToken,
  useVaiToken,
  useVaiVault
} from '../../hooks/useContract';
import { getVaiVaultAddress } from '../../utilities/addressHelpers';

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

function Vault({ settings }) {
  const [emission, setEmission] = useState('0');
  const [pendingRewards, setPendingRewards] = useState('0');
  const [availableVai, setAvailableVai] = useState(new BigNumber(0));
  const [vaiStaked, setVaiStaked] = useState(new BigNumber(0));
  const [vaiReward, setVaiReward] = useState('0');
  const [isEnabled, setIsEnabled] = useState(false);
  const [xvsBalance, setXVSBalance] = useState('');
  const { account } = useWeb3React();
  const { fastRefresh } = useRefresh();
  const compContract = useComptroller();
  const xvsTokenContract = useToken('xvs');
  const tokenContract = useVaiToken();
  const vaultContract = useVaiVault();

  const updateTotalInfo = async () => {
    const [
      venusVAIVaultRate,
      pendingRewardsTemp,
      userXvsBalance,
      availableAmount,
      { 0: staked },
      vaiRewardTemp,
      allowBalance
    ] = await Promise.all([
      compContract.methods.venusVAIVaultRate().call(),
      xvsTokenContract.methods.balanceOf(getVaiVaultAddress()).call(),
      xvsTokenContract.methods.balanceOf(account).call(),
      tokenContract.methods.balanceOf(account).call(),
      vaultContract.methods.userInfo(account).call(),
      vaultContract.methods.pendingXVS(account).call(),
      tokenContract.methods.allowance(account, getVaiVaultAddress()).call()
    ]);
    setXVSBalance(
      new BigNumber(userXvsBalance)
        .div(1e18)
        .dp(4, 1)
        .toString(10)
    );

    // total info
    setEmission(
      new BigNumber(venusVAIVaultRate)
        .div(1e18)
        .times(20 * 60 * 24)
        .dp(2, 1)
        .toString(10)
    );
    setPendingRewards(
      new BigNumber(pendingRewardsTemp)
        .div(1e18)
        .dp(4, 1)
        .toString(10)
    );
    setAvailableVai(new BigNumber(availableAmount).div(1e18));
    setVaiStaked(new BigNumber(staked).div(1e18));
    setVaiReward(
      new BigNumber(vaiRewardTemp)
        .div(1e18)
        .dp(4, 1)
        .toString(10)
    );
    setIsEnabled(new BigNumber(allowBalance).div(1e18).gt(availableAmount));
  };

  useEffect(() => {
    if (account) {
      updateTotalInfo();
    }
  }, [fastRefresh, account]);

  return (
    <MainLayout title="Vault">
      <MarketWrapper>
        <VaultWrapper className="flex">
          {process.env.REACT_APP_CHAIN_ID === '97' ? (
            <Row>
              <Column xs="12" sm="6">
                <Column xs="12">
                  <VaiTotalInfo
                    emission={emission}
                    pendingRewards={pendingRewards}
                  />
                </Column>
                <Column xs="12">
                  <VaiStaking
                    isEnabled={isEnabled}
                    availableVai={availableVai}
                    vaiStaked={vaiStaked}
                    vaiReward={vaiReward}
                    xvsBalance={xvsBalance}
                  />
                </Column>
              </Column>
              <Column xs="12" sm="6">
                <XVSVault />
              </Column>
            </Row>
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
