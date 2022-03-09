import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Select, Icon } from 'antd';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { accountActionCreators } from 'core/modules/account/actions';
import ConnectButton from 'components/Basic/ConnectButton';
import { Label } from 'components/Basic/Label';
import logoImg from 'assets/img/logo.png';
import prdtImg from 'assets/img/prdt.png';
import commaNumber from 'comma-number';
import { getBigNumber } from 'utilities/common';
import toast from 'components/Basic/Toast';
import { Setting } from 'types';
import XVSIcon from 'assets/img/venus.svg';
import XVSActiveIcon from 'assets/img/venus_active.svg';
import { State } from 'core/modules/initialState';
import { useMarkets } from '../../hooks/useMarkets';
import { useComptroller, useVaiToken } from '../../hooks/useContract';
import { getVaiVaultAddress } from '../../utilities/addressHelpers';

const SidebarWrapper = styled.div`
  height: 100vh;
  min-width: 116px;
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
    margin-right: 0;
  }
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 26px;
  i {
    font-size: 18px;
  }

  .logo-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo-text {
    @media only screen and (max-width: 375px) {
      display: none;
    }
  }

  .logo-text__mobile {
    display: none;
    @media only screen and (max-width: 375px) {
      display: block;
    }
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
  margin-top: 40px;

  @media only screen and (max-width: 768px) {
    margin: 0 20px;
  }

  .xvs-active-icon {
    display: none;
  }

  .active {
    background-color: var(--color-bg-active);
    svg {
      fill: var(--color-yellow);
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
      background-color: var(--color-bg-active);
      svg {
        fill: var(--color-yellow);
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
    padding: 7px 0;
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

interface SidebarProps extends RouteComponentProps {
  settings: Setting;
  setSetting: (setting: Partial<Setting> | undefined) => void;
  getGovernanceVenus: $TSFixMe;
}

function Sidebar({ history, setSetting }: SidebarProps) {
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
      toast.error({
        title: 'Please change your network to access the Binance Smart Chain Main Network',
      });
    }
  }, [chainId]);

  const initSettings = async () => {
    setSetting({
      pendingInfo: {
        type: '',
        status: false,
        amount: 0,
        symbol: '',
      },
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
        comptrollerContract.methods.venusVAIVaultRate().call(),
      ]);
      // Total Vai Staked
      vaultVaiStaked = new BigNumber(vaultVaiStaked).div(1e18);

      // venus vai vault rate
      venusVAIVaultRate = new BigNumber(venusVAIVaultRate).div(1e18).times(20 * 60 * 24);

      // VAI APY
      const xvsMarket = markets.find(ele => ele.underlyingSymbol === 'XVS');
      const vaiAPY = new BigNumber(venusVAIVaultRate)
        .times(xvsMarket ? xvsMarket.tokenPrice : 0)
        .times(365 * 100)
        .div(vaultVaiStaked)
        .dp(2, 1)
        .toString(10);

      const totalLiquidity = (markets || []).reduce(
        (accumulator, market) =>
          new BigNumber(accumulator).plus(new BigNumber(market.totalSupplyUsd)),
        vaultVaiStaked,
      );
      setSetting({
        vaiAPY,
        vaultVaiStaked,
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
        <NavLink className="logo-wrapper" to="/" active-class-name="active">
          <svg
            className="logo-text"
            width="80%"
            height="34"
            viewBox="0 0 160 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M36.8211 7.07724L23.1141 30.8188C22.6996 31.5348 22.1042 32.1293 21.3875 32.5425C20.6708 32.9558 19.858 33.1733 19.0307 33.1733C18.2034 33.1733 17.3906 32.9558 16.6739 32.5425C15.9572 32.1293 15.3618 31.5348 14.9473 30.8188L12.5445 26.66C12.5367 26.6497 12.5334 26.6367 12.5352 26.624C12.537 26.6112 12.5439 26.5997 12.5542 26.5919C12.5645 26.5842 12.5775 26.5809 12.5903 26.5827C12.603 26.5845 12.6145 26.5913 12.6223 26.6017C13.0509 27.0248 13.5707 27.3443 14.1417 27.5357C14.7128 27.7271 15.3201 27.7854 15.9172 27.7061C16.5143 27.6268 17.0853 27.4119 17.5865 27.078C18.0878 26.7441 18.5061 26.3 18.8094 25.7796L30.2838 5.88554C30.5863 5.3603 30.7638 4.77249 30.8027 4.16762C30.8416 3.56274 30.7407 2.95704 30.5079 2.3974C30.2751 1.83776 29.9167 1.33921 29.4603 0.940353C29.0039 0.541492 28.4618 0.253024 27.876 0.0972845C27.8631 0.0972845 27.8508 0.0921598 27.8416 0.0830379C27.8325 0.073916 27.8274 0.061544 27.8274 0.0486437C27.8274 0.0357433 27.8325 0.0233714 27.8416 0.0142495C27.8508 0.00512753 27.8631 2.89211e-06 27.876 2.89211e-06H32.7401C33.5679 0.000894092 34.3809 0.219552 35.0974 0.63402C35.814 1.04849 36.4089 1.64418 36.8224 2.36128C37.2359 3.07838 37.4534 3.89165 37.4532 4.71943C37.453 5.54721 37.235 6.36036 36.8211 7.07724ZM20.5945 2.89211e-06H15.8423C15.8326 0.00320148 15.8241 0.00939074 15.8181 0.0176883C15.8121 0.0259858 15.8089 0.035968 15.8089 0.0462116C15.8089 0.0564553 15.8121 0.0664375 15.8181 0.074735C15.8241 0.0830326 15.8326 0.0892218 15.8423 0.0924204C16.1624 0.216049 16.452 0.40733 16.6913 0.653186C16.9307 0.899043 17.1141 1.19368 17.2291 1.51696C17.3441 1.84023 17.3879 2.18453 17.3576 2.5263C17.3273 2.86808 17.2236 3.19929 17.0535 3.49728L10.127 15.4775C9.94806 15.7813 9.70406 16.0417 9.41254 16.24C9.12101 16.4383 8.7892 16.5696 8.44091 16.6245C8.09262 16.6794 7.7365 16.6564 7.39813 16.5574C7.05975 16.4583 6.74751 16.2855 6.48382 16.0515C6.47608 16.0411 6.46456 16.0343 6.45179 16.0325C6.43902 16.0307 6.42604 16.034 6.41572 16.0417C6.4054 16.0495 6.39858 16.061 6.39676 16.0738C6.39493 16.0865 6.39825 16.0995 6.40599 16.1098L8.83803 20.3319C9.1111 20.8056 9.50415 21.1992 9.97763 21.4728C10.4511 21.7464 10.9883 21.8904 11.5352 21.8904C12.082 21.8904 12.6192 21.7464 13.0927 21.4728C13.5662 21.1992 13.9592 20.8056 14.2323 20.3319L23.2941 4.66952C23.5675 4.19602 23.7113 3.65886 23.7111 3.11211C23.711 2.56535 23.5668 2.02829 23.2932 1.55494C23.0195 1.0816 22.626 0.688674 22.1523 0.415709C21.6785 0.142745 21.1413 -0.000632703 20.5945 2.89211e-06ZM4.10042 2.89211e-06C3.28943 2.89211e-06 2.49666 0.240488 1.82235 0.691048C1.14804 1.14161 0.622479 1.78201 0.312128 2.53126C0.00177667 3.28051 -0.0794253 4.10497 0.0787902 4.90037C0.237006 5.69578 0.627533 6.4264 1.20099 6.99986C1.77444 7.57331 2.50507 7.96384 3.30047 8.12205C4.09587 8.28027 4.92033 8.19907 5.66958 7.88871C6.41884 7.57836 7.05924 7.0528 7.5098 6.37849C7.96035 5.70418 8.20084 4.91141 8.20084 4.10042C8.20148 3.56177 8.09586 3.02828 7.89002 2.5305C7.68418 2.03273 7.38217 1.58045 7.00128 1.19956C6.6204 0.818674 6.16812 0.516664 5.67034 0.310825C5.17257 0.104986 4.63908 -0.000637221 4.10042 2.89211e-06Z"
              fill="url(#paint0_linear_615_1108)"
            />
            <path
              d="M69.7335 7.43983H65.6379L60.0406 20.7642L54.4706 7.43983H50.375L58.2659 25.7335H61.8427L69.7335 7.43983Z"
              fill="white"
            />
            <path
              d="M89.898 22.3751H79.7136V18.2249H89.0515V14.9211H79.7136V10.7982H89.8434V7.43983H76.0002V25.7335H89.898V22.3751Z"
              fill="white"
            />
            <path
              d="M114.357 7.43983H110.643V19.5082L100.513 7.43983H97.4008V25.7335H101.114V13.9928L111.244 25.7335H114.357V7.43983Z"
              fill="white"
            />
            <path
              d="M138.022 7.43983H134.309V17.5423C134.309 19.0713 133.927 20.3 133.162 21.2284C132.397 22.1567 131.387 22.5936 130.159 22.5936C128.848 22.5936 127.783 22.1567 126.991 21.2284C126.199 20.3 125.817 19.0713 125.817 17.5423V7.43983H122.104V17.5423C122.104 20.1089 122.841 22.184 124.316 23.7676C125.79 25.3513 127.729 26.1431 130.159 26.1431C132.507 26.1431 134.418 25.3513 135.865 23.7676C137.285 22.184 138.022 20.1089 138.022 17.5423V7.43983Z"
              fill="white"
            />
            <path
              d="M152.492 7.03027C150.362 7.03027 148.669 7.54905 147.413 8.5866C146.157 9.62415 145.529 10.9621 145.529 12.6003C145.529 15.4399 147.113 17.1874 150.335 17.8427L154.212 18.5799C154.976 18.7437 155.522 18.9894 155.85 19.2898C156.178 19.6174 156.341 20.027 156.341 20.5731C156.341 21.2557 156.041 21.8017 155.495 22.2386C154.922 22.6755 154.13 22.8939 153.092 22.8939C150.826 22.8939 149.461 21.911 148.997 19.9178L145.092 20.7096C145.311 22.457 146.13 23.8222 147.549 24.7506C148.969 25.6789 150.717 26.1431 152.737 26.1431C154.922 26.1431 156.669 25.6243 158.007 24.5867C159.318 23.5492 160 22.1567 160 20.3819C160 18.9894 159.563 17.8427 158.717 16.9689C157.87 16.0952 156.696 15.4672 155.195 15.1396L151.263 14.3477C150.034 14.1293 149.433 13.5013 149.433 12.4911C149.433 11.8631 149.707 11.317 150.253 10.8801C150.799 10.4433 151.509 10.2248 152.41 10.2248C153.338 10.2248 154.13 10.4979 154.812 11.0167C155.468 11.5354 155.877 12.218 156.014 13.0645L159.727 12.2999C159.372 10.689 158.553 9.40572 157.242 8.45008C155.932 7.52175 154.348 7.03027 152.492 7.03027Z"
              fill="white"
            />
            <defs>
              <linearGradient
                id="paint0_linear_615_1108"
                x1="36.9741"
                y1="26.2516"
                x2="-5.8511"
                y2="-2.83053"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#5433FF" />
                <stop offset="0.5" stopColor="#20BDFF" />
                <stop offset="1" stopColor="#5CFFA2" />
              </linearGradient>
            </defs>
          </svg>

          <svg
            className="logo-text__mobile"
            width="38"
            height="34"
            viewBox="0 0 38 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M37.0945 7.07724L23.3875 30.8188C22.9731 31.5348 22.3776 32.1293 21.6609 32.5425C20.9442 32.9558 20.1315 33.1733 19.3042 33.1733C18.4768 33.1733 17.6641 32.9558 16.9474 32.5425C16.2307 32.1293 15.6352 31.5348 15.2208 30.8188L12.8179 26.66C12.8102 26.6497 12.8068 26.6367 12.8087 26.624C12.8105 26.6112 12.8173 26.5997 12.8276 26.5919C12.8379 26.5842 12.8509 26.5809 12.8637 26.5827C12.8765 26.5845 12.888 26.5913 12.8957 26.6017C13.3244 27.0248 13.8441 27.3443 14.4152 27.5357C14.9863 27.7271 15.5936 27.7854 16.1906 27.7061C16.7877 27.6268 17.3587 27.4119 17.86 27.078C18.3613 26.7441 18.7796 26.3 19.0828 25.7796L30.5572 5.88554C30.8597 5.3603 31.0373 4.77249 31.0761 4.16762C31.115 3.56274 31.0142 2.95704 30.7814 2.3974C30.5486 1.83776 30.1901 1.33921 29.7337 0.940353C29.2773 0.541492 28.7353 0.253024 28.1495 0.0972845C28.1366 0.0972845 28.1242 0.0921598 28.1151 0.0830379C28.106 0.073916 28.1008 0.061544 28.1008 0.0486437C28.1008 0.0357433 28.106 0.0233714 28.1151 0.0142495C28.1242 0.00512753 28.1366 2.89211e-06 28.1495 2.89211e-06H33.0136C33.8413 0.000894092 34.6543 0.219552 35.3709 0.63402C36.0874 1.04849 36.6823 1.64418 37.0958 2.36128C37.5093 3.07838 37.7269 3.89165 37.7266 4.71943C37.7264 5.54721 37.5084 6.36036 37.0945 7.07724ZM20.868 2.89211e-06H16.1157C16.106 0.00320148 16.0975 0.00939074 16.0915 0.0176883C16.0855 0.0259858 16.0823 0.035968 16.0823 0.0462116C16.0823 0.0564553 16.0855 0.0664375 16.0915 0.074735C16.0975 0.0830326 16.106 0.0892218 16.1157 0.0924204C16.4358 0.216049 16.7254 0.40733 16.9648 0.653186C17.2041 0.899043 17.3876 1.19368 17.5025 1.51696C17.6175 1.84023 17.6614 2.18453 17.6311 2.5263C17.6008 2.86808 17.497 3.19929 17.3269 3.49728L10.4005 15.4775C10.2215 15.7813 9.9775 16.0417 9.68598 16.24C9.39445 16.4383 9.06263 16.5696 8.71434 16.6245C8.36606 16.6794 8.00994 16.6564 7.67157 16.5574C7.33319 16.4583 7.02095 16.2855 6.75726 16.0515C6.74952 16.0411 6.73799 16.0343 6.72522 16.0325C6.71245 16.0307 6.69948 16.034 6.68916 16.0417C6.67884 16.0495 6.67202 16.061 6.67019 16.0738C6.66837 16.0865 6.67169 16.0995 6.67943 16.1098L9.11147 20.3319C9.38454 20.8056 9.77759 21.1992 10.2511 21.4728C10.7246 21.7464 11.2618 21.8904 11.8086 21.8904C12.3555 21.8904 12.8927 21.7464 13.3661 21.4728C13.8396 21.1992 14.2327 20.8056 14.5057 20.3319L23.5675 4.66952C23.8409 4.19602 23.9847 3.65886 23.9846 3.11211C23.9844 2.56535 23.8403 2.02829 23.5666 1.55494C23.293 1.0816 22.8995 0.688674 22.4257 0.415709C21.952 0.142745 21.4147 -0.000632703 20.868 2.89211e-06ZM4.37386 2.89211e-06C3.56287 2.89211e-06 2.7701 0.240488 2.09579 0.691048C1.42148 1.14161 0.895916 1.78201 0.585565 2.53126C0.275214 3.28051 0.194012 4.10497 0.352228 4.90037C0.510443 5.69578 0.90097 6.4264 1.47442 6.99986C2.04788 7.57331 2.7785 7.96384 3.57391 8.12205C4.36931 8.28027 5.19377 8.19907 5.94302 7.88871C6.69227 7.57836 7.33267 7.0528 7.78323 6.37849C8.23379 5.70418 8.47428 4.91141 8.47428 4.10042C8.47492 3.56177 8.36929 3.02828 8.16346 2.5305C7.95762 2.03273 7.65561 1.58045 7.27472 1.19956C6.89383 0.818674 6.44155 0.516664 5.94378 0.310825C5.446 0.104986 4.91251 -0.000637221 4.37386 2.89211e-06Z"
              fill="url(#paint0_linear_615_2035)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_615_2035"
                x1="37.2475"
                y1="26.2516"
                x2="-5.57766"
                y2="-2.83053"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#5433FF" />
                <stop offset="0.5" stopColor="#20BDFF" />
                <stop offset="1" stopColor="#5CFFA2" />
              </linearGradient>
            </defs>
          </svg>
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
        <NavLink className="flex flex-start align-center" to="/vote" active-class-name="active">
          <Icon type="appstore" />
          <Label primary>Vote</Label>
        </NavLink>
        <NavLink className="flex flex-start align-center" to="/xvs" active-class-name="active">
          <img className="xvs-icon" src={XVSIcon} alt="xvs" />
          <img className="xvs-active-icon" src={XVSActiveIcon} alt="xvs" />
          <Label primary>XVS</Label>
        </NavLink>
        <NavLink className="flex flex-start align-center" to="/market" active-class-name="active">
          <Icon type="area-chart" />
          <Label primary>Market</Label>
        </NavLink>
        <NavLink className="flex flex-start align-center" to="/vault" active-class-name="active">
          <Icon type="golden" theme="filled" />
          <Label primary>Vault</Label>
        </NavLink>
        {process.env.REACT_APP_CHAIN_ID === '97' && (
          <NavLink
            className="flex flex-start align-center"
            to="/convert-vrt"
            active-class-name="active"
          >
            <Icon type="swap" />
            <Label primary>Convert VRT</Label>
          </NavLink>
        )}
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
          target="_blank"
          className="flex flex-start align-center"
          href="https://prdt.finance/XVS"
          active-class-name="active"
          rel="noreferrer"
        >
          <img src={prdtImg} alt="prdt" className="outlink-icon" />
          <Label primary>Prediction</Label>
        </a>
        <a
          target="_blank"
          className="flex flex-start align-center"
          href="https://community.venus.io"
          active-class-name="active"
          rel="noreferrer"
        >
          <Icon type="team" className="outlink-icon" />
          <Label primary>Forum</Label>
        </a>
      </MainMenu>
      <FaucetMenu>
        {process.env.REACT_APP_CHAIN_ID === '97' && (
          <NavLink className="flex just-center" to="/faucet" active-class-name="active">
            <Label primary>Faucet</Label>
          </NavLink>
        )}
      </FaucetMenu>
      {account && (
        <TotalValue>
          <div className="flex flex-column align-center just-center">
            <Label primary>${format(new BigNumber(tvl).dp(2, 1).toString(10))}</Label>
            <Label className="center">Total Value Locked</Label>
          </div>
        </TotalValue>
      )}
      {account && (
        <TotalValue>
          <div className="flex flex-column align-center just-center">
            <Label primary>{format(getBigNumber(totalVaiMinted).dp(0, 1).toString(10))}</Label>
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
            backgroundColor: 'var(--color-bg-main)',
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
          {process.env.REACT_APP_CHAIN_ID === '97' && (
            <Option className="flex align-center just-center" value="Convert-vrt">
              <Label size={14} primary>
                Convert VRT
              </Label>
            </Option>
          )}
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

const mapStateToProps = ({ account }: State) => ({
  settings: account.setting,
});

export default connect(mapStateToProps, accountActionCreators)(withRouter(Sidebar));
