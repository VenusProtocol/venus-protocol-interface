import React from 'react';

import metamaskImg from 'assets/img/metamask.png';
import trustwalletImg from 'assets/img/trustwallet.svg';
import safepalImg from 'assets/img/safepal.svg';
import walletconnectImg from 'assets/img/walletconnect.svg';
import ledgerImg from 'assets/img/ledger.png';
import binanceImg from 'assets/img/binance.jpg';
import arrowRightImg from 'assets/img/arrow-right.png';
import { Connector } from 'clients/web3';

export interface IConnectorListProps {
  onLogin: (connector: Connector) => void;
}

export const ConnectorList: React.FC<IConnectorListProps> = ({ onLogin }) => (
  <>
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
);
