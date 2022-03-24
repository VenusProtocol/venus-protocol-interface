import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { BASE_BSC_SCAN_URL } from 'config';
import { PrimaryButton } from '../../Button';

export interface IAccountDetailsProps {
  onLogOut: () => void;
  onCopyAccount: () => void;
  account: string;
}

export const AccountDetails: React.FC<IAccountDetailsProps> = ({
  onLogOut,
  account,
  onCopyAccount,
}) => (
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
        <CopyToClipboard text={account} onCopy={onCopyAccount}>
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
);
