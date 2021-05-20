import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import QRCode from 'qrcode.react';
import * as constants from 'utilities/constants';
import metamaskImg from 'assets/img/metamask.png';
import coinbaseImg from 'assets/img/coinbase.png';
import ledgerImg from 'assets/img/ledger.png';
import arrowRightImg from 'assets/img/arrow-right.png';
import closeImg from 'assets/img/close.png';
import logoImg from 'assets/img/logo.png';

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
    padding: 38px 78px 32px 66px;

    .metamask-connect-btn,
    .wallet-connect-btn,
    .ledger-connect-btn {
      width: 100%;
      cursor: pointer;
      padding: 27px 0px;

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

    .coinbase-connect-btn,
    .ledger-connect-btn {
      border-bottom: 1px solid var(--color-bg-active);
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

function ConnectModal({
  visible,
  web3,
  wcUri,
  error,
  awaiting,
  onCancel,
  onConnectMetaMask,
  onBack
}) {
  const MetaMaskStatus = () => {
    if (error && error.message === constants.NOT_INSTALLED) {
      return (
        <p className="center">
          We could not locate a supported web3 browser extension. We recommend
          using MetaMask.
          <a
            href="https://metamask.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download MetaMask here.
          </a>
        </p>
      );
    }
    if (error) {
      return <span>{error.message}</span>;
    }
    if (!web3 && awaiting) {
      return <span>MetaMask loading...</span>;
    }
    if (!web3) {
      return <span>Please open and allow MetaMask</span>;
    }
    return null;
  };

  return (
    <Modal
      className="connect-modal"
      width={532}
      visible={visible}
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
          {wcUri && (
            <div
              className="flex align-center back-btn pointer"
              onClick={onBack}
            >
              <img src={arrowRightImg} alt="arrow" />
              <span>Back</span>
            </div>
          )}
          <img src={logoImg} alt="logo" className="logo-image" />
          <p className="title">Connect to start using Venus</p>
        </div>
        <div className="connect-wallet-content">
          {!wcUri && (
            <>
              <div
                className={`flex align-center just-between wallet-connect-btn ${
                  process.env.REACT_APP_ENV === 'dev' ? 'disabled' : ''
                }`}
                // onClick={() => {
                //   if (process.env.REACT_APP_ENV === 'prod') {
                //     onConnectWallet();
                //   }
                // }}
              >
                <div className="flex align-center">
                  <img src={coinbaseImg} alt="coinbase wallet" />
                  <span>Wallet Connect</span>
                </div>
                <span>Coming Soon</span>
              </div>
              <div className="flex align-center just-between ledger-connect-btn">
                <div className="flex align-center">
                  <img src={ledgerImg} alt="ledger" />
                  <span>Ledger</span>
                </div>
                <span>Coming Soon</span>
                {/* <img src={arrowRightImg} alt="arrow" /> */}
              </div>
              <div
                className="flex align-center just-between metamask-connect-btn"
                onClick={onConnectMetaMask}
              >
                <div className="flex align-center">
                  <img src={metamaskImg} alt="metamask" />
                  <span>MetaMask</span>
                </div>
                <img src={arrowRightImg} alt="arrow" />
              </div>
              {(error || !web3) && (
                <div className="metamask-status">
                  <MetaMaskStatus />
                </div>
              )}
              {/* <div
                className="flex align-center just-between metamask-connect-btn"
                onClick={onConnectBinance}
              >
                <div className="flex align-center">
                  <img src={binanceImg} alt="binance" />
                  <span>Binance smart chain</span>
                </div>
                <img src={arrowRightImg} alt="arrow" />
              </div> */}
            </>
          )}
          {wcUri && (
            <div className="flex align-center just-center">
              <QRCode value={wcUri} size={256} />
            </div>
          )}
        </div>
        <p className="center terms-of-use">
          <span>By connecting, I accept Venus&lsquo;s</span>
          <a href="https://www.swipe.io/terms" target="_blank" rel="noreferrer">
            Terms of Service
          </a>
        </p>
      </ModalContent>
    </Modal>
  );
}

ConnectModal.propTypes = {
  visible: PropTypes.bool,
  web3: PropTypes.object,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  awaiting: PropTypes.bool,
  wcUri: PropTypes.string,
  onCancel: PropTypes.func,
  onConnectMetaMask: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired
};

ConnectModal.defaultProps = {
  visible: false,
  web3: {},
  error: '',
  wcUri: null,
  awaiting: false,
  onCancel: () => {}
};

export default ConnectModal;
