import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'styl... Remove this comment to see the full error message
import styled from 'styled-components';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reco... Remove this comment to see the full error message
import { compose } from 'recompose';
import { NavLink, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Select, Icon } from 'antd';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import ConnectButton from 'components/Basic/ConnectButton';
import { Label } from 'components/Basic/Label';
import { connectAccount, accountActionCreators } from 'core';
import logoImg from 'assets/img/logo.png';
import prdtImg from 'assets/img/prdt.png';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'comm... Remove this comment to see the full error message
import commaNumber from 'comma-number';
import { getBigNumber } from 'utilities/common';
import toast from 'components/Basic/Toast';
import XVSIcon from 'assets/img/venus.svg';
import XVSActiveIcon from 'assets/img/venus_active.svg';
import { useMarkets } from '../../hooks/useMarkets';
import { useComptroller, useVaiToken } from '../../hooks/useContract';
import { getVaiVaultAddress } from '../../utilities/addressHelpers';

const SidebarWrapper = styled.div`
  height: 100vh;
  min-width: 108px;
  border-radius: 0 16px 16px 0;
  background-color: var(--color-bg-primary);
  display: flex;
  flex-direction: column;
  margin-right: 8px;

  @media only screen and (max-width: 768px) {
    display: flex;
    height: 60px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-right: 0px;
  }
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 54px;
  i {
    font-size: 18px;
  }

  @media only screen and (max-width: 768px) {
    padding: 0 20px;
    img {
      width: 60px;
    }
  }

  @media only screen and (max-width: 1280px) {
    i {
      font-size: 12px !important;
    }
    img {
      width: 80px !important;
    }
  }
`;

const MainMenu = styled.div`
  margin-top: 100px;

  @media only screen and (max-width: 768px) {
    margin: 0 20px;
  }

  .xvs-active-icon {
    display: none;
  }

  .outlink-icon {
    width: 16px;
    margin-left: 11%;
    margin-right: 12%;
  }

  a {
    padding: 7px;
    i,
    img {
      width: 20%;
      margin: 0 10%;
      svg {
        fill: var(--color-text-main);
      }
    }
    .transaction {
      width: 14%;
      margin: 0 4% 0 12%;
    }
    img {
      width: 10%;
      margin: 0 13%;
    }
    span {
      width: 80%;
    }
    @media only screen and (max-width: 1440px) {
      span {
        font-size: 14px;
      }
    }

    @media only screen and (max-width: 1280px) {
      span {
        font-size: 12px;
      }
    }
    &:not(:last-child) {
      margin-bottom: 15px;
    }

    &:hover {
      svg {
        fill: var(--color-yellow);
      }
      path {
        fill: var(--color-yellow);
      }
      span {
        color: var(--color-yellow);
      }
      .xvs-icon {
        display: none;
      }
      .xvs-active-icon {
        display: block;
      }
    }
  }

  .active {
    background-color: var(--color-bg-active);
    svg {
      fill: var(--color-yellow);
    }
    span {
      color: var(--color-yellow);
    }
    path {
      fill: var(--color-yellow);
    }
    .xvs-icon {
      display: none;
    }
    .xvs-active-icon {
      display: block;
    }
  }

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const FaucetMenu = styled.div`
  width: 100%;
  margin-top: auto;
  margin-bottom: 20px;
  a {
    padding: 7px 0px;
    svg {
      fill: var(--color-text-main);
      margin-left: 34px;
      margin-right: 26px;
    }
    &:not(:last-child) {
      margin-bottom: 48px;
    }

    &:hover {
      svg {
        fill: var(--color-yellow);
      }
      span {
        color: var(--color-yellow);
      }
    }

    @media only screen and (max-width: 1440px) {
      span {
        font-size: 14px;
      }
    }

    @media only screen and (max-width: 1280px) {
      span {
        font-size: 12px;
      }
    }
  }
  .active {
    background-color: var(--color-bg-active);
    svg {
      fill: var(--color-yellow);
    }
    span {
      color: var(--color-yellow);
    }
  }

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const TotalValue = styled.div`
  width: 100%;
  margin-bottom: 20px;

  > div {
    span:first-child {
      word-break: break-all;
      text-align: center;
    }
  }

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  display: none;

  @media only screen and (max-width: 768px) {
    display: block;
    position: relative;
    .ant-select {
      .ant-select-selection {
        background-color: transparent;
        border: none;
        color: var(--color-text-main);
        font-size: 17px;
        font-weight: 900;
        color: var(--color-text-main);
        margin-top: 4px;
        i {
          color: var(--color-text-main);
        }
      }
    }
  }
`;

const { Option } = Select;

const format = commaNumber.bindWith(',', '.');

function Sidebar({
  history,
  settings,
  setSetting,
  getGovernanceVenus
}: 
$TSFixMe) {
  const [isMarketInfoUpdating, setMarketInfoUpdating] = useState(false);
  const [totalVaiMinted, setTotalVaiMinted] = useState('0');
  const [tvl, setTVL] = useState(new BigNumber(0));
  const { markets } = useMarkets();
  const comptrollerContract = useComptroller();
  const vaiTokenContract = useVaiToken();

  const defaultPath = history.location.pathname.split('/')[1];
  const { account, chainId } = useWeb3React();

  useEffect(() => {
    if (chainId && chainId !== Number(process.env.REACT_APP_CHAIN_ID)) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      toast.error({
        title: `Please change your network to access the Binance Smart Chain Main Network`
      });
    }
  }, [chainId]);

  const initSettings = async () => {
    setSetting({
      pendingInfo: {
        type: '',
        status: false,
        amount: 0,
        symbol: ''
      }
    });
  };

  const getTotalVaiMinted = async () => {
    // total vai minted
    let tvm = await vaiTokenContract.methods.totalSupply().call();
    tvm = new BigNumber(tvm).div(new BigNumber(10).pow(18));
    setTotalVaiMinted(tvm);
  };

  
  const onChangePage = (value: $TSFixMe) => {
    if (value === 'prediction') {
      window.open('https://prdt.finance/XVS');
    } else if (value === 'forum') {
      window.open('https://community.venus.io');
    } else {
      history.push(`/${value}`);
    }
  };

  useEffect(() => {
    getTotalVaiMinted();
  }, [markets]);

  useEffect(() => {
    initSettings();
  }, []);

  const updateMarketInfo = async () => {
    if (!account || !markets || isMarketInfoUpdating) {
      return;
    }

    setMarketInfoUpdating(true);

    try {
      let [vaultVaiStaked, venusVAIVaultRate] = await Promise.all([
        vaiTokenContract.methods.balanceOf(getVaiVaultAddress()).call(),
        comptrollerContract.methods.venusVAIVaultRate().call()
      ]);
      // Total Vai Staked
      vaultVaiStaked = new BigNumber(vaultVaiStaked).div(1e18);

      // venus vai vault rate
      venusVAIVaultRate = new BigNumber(venusVAIVaultRate)
        .div(1e18)
        .times(20 * 60 * 24);

      // VAI APY
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'underlyingSymbol' does not exist on type... Remove this comment to see the full error message
      const xvsMarket = markets.find(ele => ele.underlyingSymbol === 'XVS');
      const vaiAPY = new BigNumber(venusVAIVaultRate)
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'tokenPrice' does not exist on type 'neve... Remove this comment to see the full error message
        .times(xvsMarket ? xvsMarket.tokenPrice : 0)
        .times(365 * 100)
        .div(vaultVaiStaked)
        .dp(2, 1)
        .toString(10);

      const totalLiquidity = (markets || []).reduce((accumulator, market) => {
        return new BigNumber(accumulator).plus(
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'totalSupplyUsd' does not exist on type '... Remove this comment to see the full error message
          new BigNumber(market.totalSupplyUsd)
        );
      }, vaultVaiStaked);
      setSetting({
        vaiAPY,
        vaultVaiStaked
      });

      setTVL(totalLiquidity);
      setMarketInfoUpdating(false);
    } catch (error) {
      console.log(error);
      setMarketInfoUpdating(false);
    }
  };

  useEffect(() => {
    updateMarketInfo();
  }, [markets]);

  return (
    <SidebarWrapper>
      <Logo>
        <NavLink to="/" active-class-name="active">
          <img src={logoImg} alt="logo" className="logo-text" />
        </NavLink>
      </Logo>
      <MainMenu>
        <NavLink
          className="flex flex-start align-center"
          to="/dashboard"
          active-class-name="active"
        >
          <Icon type="home" theme="filled" />
          <Label primary>Dashboard</Label>
        </NavLink>
        <NavLink
          className="flex flex-start align-center"
          to="/vote"
          active-class-name="active"
        >
          <Icon type="appstore" />
          <Label primary>Vote</Label>
        </NavLink>
        <NavLink
          className="flex flex-start align-center"
          to="/xvs"
          active-class-name="active"
        >
          <img className="xvs-icon" src={XVSIcon} alt="xvs" />
          <img className="xvs-active-icon" src={XVSActiveIcon} alt="xvs" />
          <Label primary>XVS</Label>
        </NavLink>
        <NavLink
          className="flex flex-start align-center"
          to="/market"
          active-class-name="active"
        >
          <Icon type="area-chart" />
          <Label primary>Market</Label>
        </NavLink>
        <NavLink
          className="flex flex-start align-center"
          to="/vault"
          active-class-name="active"
        >
          <Icon type="golden" theme="filled" />
          <Label primary>Vault</Label>
        </NavLink>
        <NavLink
          className="flex flex-start align-center"
          to="/transaction"
          active-class-name="active"
        >
          <svg
            className="transaction"
            width="12"
            height="16"
            viewBox="0 0 12 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 0H7.488L12 4.20571V16H0V0ZM1.92 14.1714H10.08V5.02857H6.72V1.82857H1.92V14.1714ZM3.84703 8.62036H8.16703V6.79179H3.84703V8.62036ZM3.84703 12.2775H8.16703V10.449H3.84703V12.2775Z"
              fill="white"
            />
          </svg>
          <div className="flex flex-column align-center">
            <Label primary>Transactions</Label>
          </div>
        </NavLink>
        <a
          // eslint-disable-next-line react/jsx-no-target-blank
          target="_blank"
          className="flex flex-start align-center"
          href="https://prdt.finance/XVS"
          active-class-name="active"
        >
          <img src={prdtImg} alt="prdt" className="outlink-icon" />
          <Label primary>XVS Prediction</Label>
        </a>
        <a
          // eslint-disable-next-line react/jsx-no-target-blank
          target="_blank"
          className="flex flex-start align-center"
          href="https://community.venus.io"
          active-class-name="active"
        >
          <Icon type="team" className="outlink-icon" />
          <Label primary>Forum</Label>
        </a>
      </MainMenu>
      <FaucetMenu>
        {process.env.REACT_APP_CHAIN_ID === '97' && (
          <NavLink
            className="flex just-center"
            to="/faucet"
            active-class-name="active"
          >
            <Label primary>Faucet</Label>
          </NavLink>
        )}
      </FaucetMenu>
      {account && (
        <TotalValue>
          <div className="flex flex-column align-center just-center">
            <Label primary>
              ${format(new BigNumber(tvl).dp(2, 1).toString(10))}
            </Label>
            <Label className="center">Total Value Locked</Label>
          </div>
        </TotalValue>
      )}
      {account && (
        <TotalValue>
          <div className="flex flex-column align-center just-center">
            <Label primary>
              {format(
                getBigNumber(totalVaiMinted)
                  .dp(0, 1)
                  .toString(10)
              )}
            </Label>
            <Label className="center">Total VAI Minted</Label>
          </div>
        </TotalValue>
      )}
      <ConnectButton />
      <MobileMenu id="main-menu">
        <Select
          defaultValue={defaultPath}
          style={{ width: 120, marginRight: 10 }}
          // @ts-expect-error ts-migrate(2322) FIXME: Type '() => HTMLElement | null' is not assignable ... Remove this comment to see the full error message
          getPopupContainer={() => document.getElementById('main-menu')}
          dropdownMenuStyle={{
            backgroundColor: '#090d27'
          }}
          dropdownClassName="asset-select"
          onChange={onChangePage}
        >
          <Option className="flex align-center just-center" value="dashboard">
            <Label size={14} primary>
              Dashboard
            </Label>
          </Option>
          <Option className="flex align-center just-center" value="vote">
            <Label size={14} primary>
              Vote
            </Label>
          </Option>
          <Option className="flex align-center just-center" value="xvs">
            <Label size={14} primary>
              XVS
            </Label>
          </Option>
          <Option className="flex align-center just-center" value="market">
            <Label size={14} primary>
              Market
            </Label>
          </Option>
          <Option className="flex align-center just-center" value="vault">
            <Label size={14} primary>
              Vault
            </Label>
          </Option>
          <Option className="flex align-center just-center" value="transaction">
            <Label size={14} primary>
              Transactions
            </Label>
          </Option>
          <Option className="flex align-center just-center" value="prediction">
            <Label size={14} primary>
              XVS Prediction
            </Label>
          </Option>
          <Option className="flex align-center just-center" value="forum">
            <Label size={14} primary>
              Forum
            </Label>
          </Option>
          {process.env.REACT_APP_CHAIN_ID === '97' && (
            <Option className="flex align-center just-center" value="faucet">
              <Label size={14} primary>
                Faucet
              </Label>
            </Option>
          )}
        </Select>
      </MobileMenu>
    </SidebarWrapper>
  );
}

Sidebar.propTypes = {
  history: PropTypes.object,
  settings: PropTypes.object,
  setSetting: PropTypes.func.isRequired,
  getGovernanceVenus: PropTypes.func.isRequired
};

Sidebar.defaultProps = {
  settings: {},
  history: {}
};


const mapStateToProps = ({ account }: $TSFixMe) => ({
  settings: account.setting
});


const mapDispatchToProps = (dispatch: $TSFixMe) => {
  const { setSetting, getGovernanceVenus } = accountActionCreators;

  return bindActionCreators(
    {
      setSetting,
      getGovernanceVenus
    },
    dispatch
  );
};

export default compose(
  withRouter,
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 0-1 arguments, but got 2.
  connectAccount(mapStateToProps, mapDispatchToProps)
)(Sidebar);
