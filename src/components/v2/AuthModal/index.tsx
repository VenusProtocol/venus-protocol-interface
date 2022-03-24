import React from 'react';
import styled from 'styled-components';
import { Modal } from 'antd';

import closeImg from 'assets/img/close.png';
import { AccountDetails, IAccountDetailsProps } from './AccountDetails';
import { ConnectorList, IConnectorListProps } from './ConnectorList';

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
  onLogin: IConnectorListProps['onLogin'];
  onLogOut: IAccountDetailsProps['onLogOut'];
  onCopyAccount: IAccountDetailsProps['onCopyAccount'];
  account?: IAccountDetailsProps['account'];
}

export const AuthModal: React.FC<IAuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onLogOut,
  onCopyAccount,
  account,
}) => (
  // TODO: refactor to use new Modal component
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
      {!account ? (
        <ConnectorList onLogin={onLogin} />
      ) : (
        <AccountDetails account={account} onCopyAccount={onCopyAccount} onLogOut={onLogOut} />
      )}
    </ModalContent>
  </Modal>
);
