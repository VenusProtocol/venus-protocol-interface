import { useCallback } from 'react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { NoBscProviderError } from '@binance-chain/bsc-connector';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector';
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector
} from '@web3-react/walletconnect-connector';
import toast from 'components/Basic/Toast';
import { connectorLocalStorageKey } from '../config';
import { connectorsByName } from '../utilities/connectors';
import { setupNetwork } from '../utilities/wallet';

const useAuth = () => {
  const { chainId, activate, deactivate } = useWeb3React();
  const login = useCallback(
    connectorID => {
      const connector = connectorsByName[connectorID];
      if (connector) {
        activate(connector, async error => {
          if (error instanceof UnsupportedChainIdError) {
            const hasSetup = await setupNetwork();
            if (hasSetup) {
              activate(connector);
            }
          } else {
            window.localStorage.removeItem(connectorLocalStorageKey);
            if (
              error instanceof NoEthereumProviderError ||
              error instanceof NoBscProviderError
            ) {
              toast.error({ title: 'No provider was found' });
            } else if (
              error instanceof UserRejectedRequestErrorInjected ||
              error instanceof UserRejectedRequestErrorWalletConnect
            ) {
              if (connector instanceof WalletConnectConnector) {
                const walletConnector = connector;
                walletConnector.walletConnectProvider = null;
              }
              toast.error({ title: 'Please authorize to access your account' });
            } else {
              toast.error({ title: error.message });
            }
          }
        });
      } else {
        toast.error({ title: 'The connector config is wrong' });
      }
    },
    [activate, toastError]
  );

  const logout = useCallback(() => {
    deactivate();
    // This localStorage key is set by @web3-react/walletconnect-connector
    if (window.localStorage.getItem('walletconnect')) {
      connectorsByName.walletconnect.close();
      connectorsByName.walletconnect.walletConnectProvider = null;
    }
    window.localStorage.removeItem(connectorLocalStorageKey);
  }, [deactivate, chainId]);

  return { login, logout };
};

export default useAuth;
