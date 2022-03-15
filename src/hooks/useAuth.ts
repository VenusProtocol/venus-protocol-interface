import { useCallback } from 'react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { NoBscProviderError } from '@binance-chain/bsc-connector';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector';
import toast from 'components/Basic/Toast';
import { LS_KEY_IS_USER_LOGGED_IN } from '../config';
import { connectorsByName, ConnectorNames } from '../utilities/connectors';
import { setupNetwork } from '../utilities/wallet';

const useAuth = () => {
  const { activate, deactivate } = useWeb3React();
  const login = useCallback(
    async (connectorID: ConnectorNames) => {
      const connector = connectorsByName[connectorID];
      if (!connector) {
        toast.error({
          title: 'An internal error occurred: wrong connector config. Please try again later',
        });
        return;
      }

      try {
        // Log user in
        await activate(connector, undefined, true);

        // Mark user as logged in
        window.localStorage.setItem(LS_KEY_IS_USER_LOGGED_IN, 'true');
      } catch (error) {
        if (error instanceof UnsupportedChainIdError) {
          const hasSetup = await setupNetwork();
          if (hasSetup) {
            await activate(connector);
          }

          return;
        }

        // Reset wallet connect provider if user denied access to their account
        if (
          (error instanceof UserRejectedRequestErrorInjected ||
            error instanceof UserRejectedRequestErrorWalletConnect) &&
          connector instanceof WalletConnectConnector
        ) {
          connector.walletConnectProvider = undefined;
        }

        // Display error message
        let errorMessage;

        if (
          error instanceof UserRejectedRequestErrorInjected ||
          error instanceof UserRejectedRequestErrorWalletConnect
        ) {
          errorMessage = 'You need to authorize access to your account';
        } else if (
          error instanceof NoEthereumProviderError ||
          error instanceof NoBscProviderError
        ) {
          errorMessage = 'An internal error occurred: no provider found. Please try again later';
        } else {
          errorMessage = (error as Error).message;
        }

        toast.error({ title: errorMessage });
      }
    },
    [activate],
  );

  const logout = useCallback(() => {
    deactivate();
    // This localStorage key is set by @web3-react/walletconnect-connector
    if (window.localStorage.getItem('walletconnect')) {
      connectorsByName[ConnectorNames.WalletConnect].close();
      connectorsByName[ConnectorNames.WalletConnect].walletConnectProvider = undefined;
    }

    // Remove flag indicating user is logged in
    window.localStorage.removeItem(LS_KEY_IS_USER_LOGGED_IN);
  }, [deactivate]);

  return { login, logout };
};

export default useAuth;
