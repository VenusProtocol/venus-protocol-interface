import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from 'styled-components';
import { Modal } from 'antd';

import metamaskImg from 'assets/img/metamask.png';
import trustwalletImg from 'assets/img/trustwallet.svg';
import safepalImg from 'assets/img/safepal.svg';
import walletconnectImg from 'assets/img/walletconnect.svg';
import ledgerImg from 'assets/img/ledger.png';
import binanceImg from 'assets/img/binance.jpg';
import arrowRightImg from 'assets/img/arrow-right.png';
import closeImg from 'assets/img/close.png';
import { ReactComponent as VenusLogo } from 'assets/img/v2/venusLogoWithText.svg';
import { PrimaryButton } from 'components';
import toast from 'components/Basic/Toast';
import { BASE_BSC_SCAN_URL } from 'config';
import { Connector } from 'clients/web3';

// TODO: refactor
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

  .terms-of-use {
    font-size: 13.5px;
    color: var(--color-text-secondary);
    margin-bottom: 32px;
    a {
      color: var(--color-orange);
      margin-left: 11px;
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
      margin: 15px 0;

      span {
        color: var(--color-text-secondary);
        font-weight: normal;
        font-size: 17px;
      }

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
    }

    .coming-soon {
      cursor: auto;
    }

    .line {
      width: 100% auto;
      height: 1px;
      background-color: var(--color-bg-active);
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

  .wallet-section {
    .header-title {
      margin-top: 23px;
      font-size: 24.5px;
      font-weight: bold;
      color: var(--color-yellow);
      border-bottom: 1px solid var(--color-bg-active);
    }

    .wallet-body {
      margin-top: 20px;
      .wallet-address {
        font-size: 16px;
        color: var(--color-text-main);
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .wallet-links {
        display: flex;
        margin-top: 15px;
        color: var(--color-text-main);

        svg {
          margin-left: 5px;
          fill: var(--color-text-main);
        }

        .wallet-link-scan {
          display: flex;
          cursor: pointer;

          &:hover {
            color: var(--color-yellow);
            svg {
              fill: var(--color-yellow);
            }
          }
        }

        .wallet-link-copy {
          display: flex;
          margin-left: 20px;
          cursor: pointer;

          &:hover {
            color: var(--color-yellow);
            svg {
              fill: var(--color-yellow);
            }
          }
        }
      }
    }

    .wallet-footer {
      display: flex;
      justify-content: center;
      margin: 30px 0;

      .logout-btn {
        width: 114px;
        height: 30px;

        @media only screen and (max-width: 768px) {
          width: 100px;
        }
      }
    }
  }
`;

export interface IAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (connector: Connector) => void;
  onLogOut: () => void;
  account?: string;
}

export const AuthModal: React.FC<IAuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onLogOut,
  account,
}) => (
  <Modal
    className="venus-modal"
    width={532}
    visible={isOpen}
    onCancel={onClose}
    footer={null}
    closable={false}
    maskClosable
    centered
  >
    <ModalContent className="flex flex-column align-center just-center">
      <img className="close-btn pointer" src={closeImg} alt="close" onClick={onClose} />
      {!account ? (
        <>
          <div className="flex flex-column align-center just-center header-content">
            <VenusLogo className="logo-image" />
            <p className="title">Connect to start using Venus</p>
          </div>
          <div className="connect-wallet-content">
            <div className="flex align-center just-between metamask-connect-btn coming-soon">
              <div className="flex align-center">
                <img src={ledgerImg} alt="ledger" />
                <span>Ledger</span>
              </div>
              <span>Coming soon...</span>
            </div>
            <div className="flex align-center just-between metamask-connect-btn coming-soon">
              <div className="flex align-center">
                <img src={safepalImg} alt="safepal" />
                <span>SafePal</span>
              </div>
              <span>Coming soon...</span>
            </div>
            <div className="line" />
            <div
              className="flex align-center just-between metamask-connect-btn"
              onClick={() => onLogin(Connector.MetaMask)}
            >
              <div className="flex align-center">
                <img src={metamaskImg} alt="metamask" />
                <span>MetaMask</span>
              </div>
              <img src={arrowRightImg} alt="arrow" />
            </div>
            <div
              className="flex align-center just-between metamask-connect-btn"
              onClick={() => onLogin(Connector.MetaMask)}
            >
              <div className="flex align-center">
                <img src={trustwalletImg} alt="trustwallet" />
                <span>Trust Wallet</span>
              </div>
              <img src={arrowRightImg} alt="arrow" />
            </div>
            <div
              className="flex align-center just-between metamask-connect-btn"
              onClick={() => onLogin(Connector.WalletConnect)}
            >
              <div className="flex align-center">
                <img src={walletconnectImg} alt="coinbase wallet" />
                <span>WalletConnect</span>
              </div>
              <img src={arrowRightImg} alt="arrow" />
            </div>
            <div
              className="flex align-center just-between metamask-connect-btn"
              onClick={() => onLogin(Connector.BSC)}
            >
              <div className="flex align-center">
                <img src={binanceImg} alt="binance" />
                <span>Binance Chain Wallet</span>
              </div>
              <img src={arrowRightImg} alt="arrow" />
            </div>
          </div>
          <p className="center terms-of-use">
            <span>By connecting, I accept Venus&lsquo;s</span>
            <a href="https://www.swipe.io/terms" target="_blank" rel="noreferrer">
              Terms of Service
            </a>
          </p>
        </>
      ) : (
        <div className="wallet-section">
          <div className="header-title">Your Wallet</div>
          <div className="wallet-body">
            <div className="wallet-address">{account}</div>
            <div className="wallet-links">
              <div
                className="wallet-link-scan"
                onClick={() => {
                  window.open(`${BASE_BSC_SCAN_URL}/address/${account}`, '_blank');
                }}
              >
                <span>View on BscScan</span>
                <svg
                  viewBox="0 0 24 24"
                  width="20px"
                  xmlns="http://www.w3.org/2000/svg"
                  className="sc-bdvvaa cpQaOW"
                >
                  <path d="M18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13C21 12.45 20.55 12 20 12C19.45 12 19 12.45 19 13V18C19 18.55 18.55 19 18 19ZM14 4C14 4.55 14.45 5 15 5H17.59L8.46 14.13C8.07 14.52 8.07 15.15 8.46 15.54C8.85 15.93 9.48 15.93 9.87 15.54L19 6.41V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 3.45 20.55 3 20 3H15C14.45 3 14 3.45 14 4Z" />
                </svg>
              </div>
              <CopyToClipboard
                text={account}
                onCopy={() => {
                  toast.success({
                    title: 'Copied address',
                  });
                }}
              >
                <div className="wallet-link-copy">
                  <span>Copy Address</span>
                  <svg
                    viewBox="0 0 24 24"
                    width="20px"
                    color="primary"
                    xmlns="http://www.w3.org/2000/svg"
                    className="sc-bdvvaa cpQaOW"
                  >
                    <path d="M15 1H4C2.9 1 2 1.9 2 3V16C2 16.55 2.45 17 3 17C3.55 17 4 16.55 4 16V4C4 3.45 4.45 3 5 3H15C15.55 3 16 2.55 16 2C16 1.45 15.55 1 15 1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM18 21H9C8.45 21 8 20.55 8 20V8C8 7.45 8.45 7 9 7H18C18.55 7 19 7.45 19 8V20C19 20.55 18.55 21 18 21Z" />
                  </svg>
                </div>
              </CopyToClipboard>
            </div>
          </div>
          <div className="wallet-footer">
            <PrimaryButton className="logout-btn" onClick={onLogOut}>
              Logout
            </PrimaryButton>
          </div>
        </div>
      )}
    </ModalContent>
  </Modal>
);
