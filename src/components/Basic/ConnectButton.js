import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Modal } from 'antd';
import metamaskImg from 'assets/img/metamask.png';
import safepalImg from 'assets/img/safepal.svg';
import walletconnectImg from 'assets/img/walletconnect.svg';
import ledgerImg from 'assets/img/ledger.png';
import binanceImg from 'assets/img/binance.jpg';
import arrowRightImg from 'assets/img/arrow-right.png';
import closeImg from 'assets/img/close.png';
import logoImg from 'assets/img/logo.png';
import useAuth from '../../hooks/useAuth';
import { ConnectorNames } from '../../utilities/connectors';
import { useWeb3React } from '@web3-react/core';
import Button from '@material-ui/core/Button';

const ConnectButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  @media only screen and (max-width: 768px) {
    margin: 0;
  }

  .connect-btn {
    width: 114px;
    height: 30px;
    border-radius: 5px;
    background-image: linear-gradient(to right, #f2c265, #f7b44f);

    @media only screen and (max-width: 768px) {
      width: 100px;
    }

    .MuiButton-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--color-text-main);
      text-transform: capitalize;

      @media only screen and (max-width: 768px) {
        font-size: 12px;
      }
    }
  }
`;

const ModalContent = styled.div`
  border-radius: 20px;
  background-color: var(--color-bg-primary);

  .close-btn {
    position: absolute;
    top: 23px;
    right: 23px;
  }

  .header-content {
    width: 100%;
    margin-top: 60px;
    .logo-image {
      width: 153px;
      height: 34px;
      margin-bottom: 43px;
    }
    .title {
      font-size: 24.5px;
      color: var(--color-text-main);
    }

    .back-btn {
      width: 100%;
      padding: 10px 30px;
      img {
        transform: rotate(180deg);
        margin-right: 10px;
      }
      span {
        color: var(--color-white);
        font-size: 20px;
      }
    }
  }
  .connect-wallet-content {
    width: 100%;
    padding: 30px 60px;

    @media only screen and (max-width: 768px) {
      padding: 15px;
    }

    .metamask-connect-btn {
      width: 100%;
      cursor: pointer;
      padding: 10px;
      height: 65px;
      border: 1px solid var(--color-bg-active);
      margin: 15px 0;

      & > div {
        img {
          width: 45px;
          margin-right: 44px;
        }
        span {
          color: var(--color-text-main);
          font-weight: normal;
          font-size: 17px;
        }
      }

      span {
        color: var(--color-text-secondary);
        font-weight: normal;
        font-size: 17px;
      }
    }

    .metamask-status {
      margin-top: 20px;
      background-color: rgba(255, 0, 0, 0.03);
      padding: 5px 10px;
      border-radius: 4px;
      color: var(--color-red);
      a {
        margin-left: 5px;
      }
    }
  }

  .terms-of-use {
    font-size: 13.5px;
    color: var(--color-text-secondary);
    margin-bottom: 32px;
    a {
      color: var(--color-orange);
      margin-left: 11px;
    }
  }
`;

function ConnectButton() {
  const { login } = useAuth();
  const { account } = useWeb3React();
  const [showConnect, setShowConnect] = useState(false);
  const [showDisonnect, setShowDisconnect] = useState(false);

  const onCancel = () => {
    setShowConnect(false);
  };

  const handleConnect = useCallback(
    type => {
      onCancel();
      login(type);
    },
    [login, setShowConnect]
  );

  const handleClick = useCallback(() => {
    if (!account) {
      setShowConnect(true);
    } else {
      setShowDisconnect(true);
    }
  }, [account, setShowConnect]);

  return (
    <ConnectButtonWrapper>
      <Button
        className="connect-btn"
        onClick={() => {
          handleClick();
        }}
      >
        {!account
          ? 'Connect'
          : `${account.substr(0, 6)}...${account.substr(
              account.length - 4,
              4
            )}`}
      </Button>
      <Modal
        className="connect-modal"
        width={532}
        visible={showConnect}
        onCancel={onCancel}
        footer={null}
        closable={false}
        maskClosable
        centered
      >
        <ModalContent className="flex flex-column align-center just-center">
          <img
            className="close-btn pointer"
            src={closeImg}
            alt="close"
            onClick={onCancel}
          />
          <div className="flex flex-column align-center just-center header-content">
            <img src={logoImg} alt="logo" className="logo-image" />
            <p className="title">Connect to start using Venus</p>
          </div>
          <div className="connect-wallet-content">
            <div
              className="flex align-center just-between metamask-connect-btn"
              onClick={() => handleConnect(ConnectorNames.Injected)}
            >
              <div className="flex align-center">
                <img src={metamaskImg} alt="metamask" />
                <span>MetaMask</span>
              </div>
              <img src={arrowRightImg} alt="arrow" />
            </div>
            {process.env.REACT_APP_CHAIN_ID === '56' && (
              <div
                className="flex align-center just-between metamask-connect-btn"
                onClick={() => handleConnect(ConnectorNames.WalletConnect)}
              >
                <div className="flex align-center">
                  <img src={walletconnectImg} alt="coinbase wallet" />
                  <span>Wallet Connect</span>
                </div>
                <img src={arrowRightImg} alt="arrow" />
              </div>
            )}
            <div
              className="flex align-center just-between metamask-connect-btn"
              onClick={() => handleConnect(ConnectorNames.BSC)}
            >
              <div className="flex align-center">
                <img src={binanceImg} alt="binance" />
                <span>Binance Chain Wallet</span>
              </div>
              <img src={arrowRightImg} alt="arrow" />
            </div>
            <div
              className="flex align-center just-between metamask-connect-btn"
              onClick={() => handleConnect(ConnectorNames.Ledger)}
            >
              <div className="flex align-center">
                <img src={ledgerImg} alt="ledger" />
                <span>Ledger</span>
              </div>
              <img src={arrowRightImg} alt="arrow" />
            </div>
            <div
              className="flex align-center just-between metamask-connect-btn"
              onClick={() => handleConnect(ConnectorNames.Injected)}
            >
              <div className="flex align-center">
                <img src={safepalImg} alt="safepal" />
                <span>SafePal</span>
              </div>
              <img src={arrowRightImg} alt="arrow" />
            </div>
          </div>
          <p className="center terms-of-use">
            <span>By connecting, I accept Venus&lsquo;s</span>
            <a
              href="https://www.swipe.io/terms"
              target="_blank"
              rel="noreferrer"
            >
              Terms of Service
            </a>
          </p>
        </ModalContent>
      </Modal>
    </ConnectButtonWrapper>
  );
}

export default ConnectButton;
