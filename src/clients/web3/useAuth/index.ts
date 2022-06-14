import { useCallback, useState } from 'react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { NoBscProviderError } from '@binance-chain/bsc-connector';
import { openInfinityWallet } from '@infinitywallet/infinity-connector';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector';
import { toast } from 'components/v2/Toast';
import { LS_KEY_CONNECTED_CONNECTOR, CHAIN_ID } from 'config';
import { useTranslation } from 'translation';
import { connectorsByName } from '../connectors';
import { Connector } from '../types';
import setupNetwork from './setUpNetwork';

const isRunningInInfinityWalletApp = () => window.ethereum && window.ethereum?.isInfinityWallet;

const getConnectedConnector = (): Connector | undefined => {
  const lsConnectedConnector = window.localStorage.getItem(LS_KEY_CONNECTED_CONNECTOR);

  return lsConnectedConnector &&
    Object.values(Connector).includes(lsConnectedConnector as Connector)
    ? (lsConnectedConnector as Connector)
    : undefined;
};

const useAuth = () => {
  const { t } = useTranslation();

  const { activate, deactivate, account } = useWeb3React();

  const [connectedConnector, setConnectedConnector] = useState(getConnectedConnector());

  const login = useCallback(
    async (connectorID: Connector) => {
      // If user are attempting to connect their Infinity wallet but the dApp
      // isn't currently running in the Infinity Wallet app, open it
      if (connectorID === Connector.InfinityWallet && !isRunningInInfinityWalletApp()) {
        openInfinityWallet(window.location.href, CHAIN_ID);
        return;
      }

      const connector = connectorsByName[connectorID];
      if (!connector) {
        // TODO: log error to Sentry (this case should never happen, as it means
        // an incorrect connectorID was passed to this function)

        toast.error({
          message: t('wallets.errors.unsupportedWallet'),
        });
        return;
      }

      try {
        // Log user in
        await activate(connector, undefined, true);

        // Mark user as logged in
        window.localStorage.setItem(LS_KEY_CONNECTED_CONNECTOR, connectorID);
        setConnectedConnector(connectorID);
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
          errorMessage = t('wallets.errors.authorizeAccess');
        } else if (
          error instanceof NoEthereumProviderError ||
          error instanceof NoBscProviderError
        ) {
          // TODO: log error to Sentry

          errorMessage = t('wallets.errors.noProvider');
        } else {
          errorMessage = (error as Error).message;
        }

        toast.error({ message: errorMessage });
      }
    },
    [activate],
  );

  const logOut = useCallback(() => {
    deactivate();
    // This localStorage key is set by @web3-react/walletconnect-connector
    if (window.localStorage.getItem('walletconnect')) {
      connectorsByName[Connector.WalletConnect].close();
      connectorsByName[Connector.WalletConnect].walletConnectProvider = undefined;
    }

    // Remove flag indicating user is logged in
    window.localStorage.removeItem(LS_KEY_CONNECTED_CONNECTOR);
    setConnectedConnector(undefined);
  }, [deactivate]);

  return { login, logOut, accountAddress: account, connectedConnector };
};

export default useAuth;
