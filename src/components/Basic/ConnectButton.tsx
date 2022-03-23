import React from 'react';
import styled from 'styled-components';
import { Modal } from 'antd';
import metamaskImg from 'assets/img/metamask.png';
import trustwalletImg from 'assets/img/trustwallet.svg';
import safepalImg from 'assets/img/safepal.svg';
import walletconnectImg from 'assets/img/walletconnect.svg';
import coinbaseWalletImg from 'assets/img/v2/coinbaseWalletLogo.svg';
import ledgerImg from 'assets/img/ledger.png';
import binanceImg from 'assets/img/binance.jpg';
import arrowRightImg from 'assets/img/arrow-right.png';
import closeImg from 'assets/img/close.png';
import { ReactComponent as VenusLogo } from 'assets/img/v2/venusLogoWithText.svg';
import { PrimaryButton, SecondaryButton } from 'components/v2/Button';
import toast from 'components/Basic/Toast';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useAuth, Connector, useWeb3Account } from 'clients/web3';
import { BASE_BSC_SCAN_URL } from 'config';
import { AuthContext } from 'context/AuthContext';

// TODO: remove
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
  }
`;

function ConnectButton() {
  // TODO: move to containers
  const { openAuthModal, account } = React.useContext(AuthContext);

  return (
    <ConnectButtonWrapper>
      <SecondaryButton className="connect-btn" onClick={openAuthModal}>
        {!account
          ? 'Connect'
          : `${account.substr(0, 6)}...${account.substr(account.length - 4, 4)}`}
      </SecondaryButton>
    </ConnectButtonWrapper>
  );
}

export default ConnectButton;
