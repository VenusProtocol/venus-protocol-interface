import { type Locale, RainbowKitProvider, type Theme, darkTheme } from '@rainbow-me/rainbowkit';
import { theme } from '@venusprotocol/ui';
import { watchAccount } from '@wagmi/core';
import merge from 'lodash.merge';
import { useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import { useAccount, useConfig, useConnections } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

import '@rainbow-me/rainbowkit/styles.css';
import { useTranslation } from 'libs/translations';

const LOG_PREFIX = '[WalletConnectDebug]';

export interface RainwbowKitWrapperProps extends PropsWithChildren {}

const rkTheme = merge(
  darkTheme({
    accentColor: theme.colors.blue,
    borderRadius: 'small',
  }),
  {
    fonts: {
      body: '"ProximaNova", var(--font-fallback)',
    },
    colors: {
      closeButtonBackground: 'transparent',
      generalBorder: theme.colors['dark-blue-hover'],
      selectedOptionBorder: theme.colors['dark-blue-hover'],
      modalBorder: theme.colors.blue,
      modalBackground: theme.colors['dark-blue'],
    },
  } as Theme,
);

const WalletStateWatcher: React.FC = () => {
  const config = useConfig();
  const { connectModalOpen } = useConnectModal();
  const { isConnected, address, status, connector } = useAccount();
  const connections = useConnections();

  useEffect(() => {
    if (!connectModalOpen) return;

    const interval = setInterval(() => {
      if (connections.length > 0 && !isConnected) {
        console.warn(`${LOG_PREFIX} ⚠️ [Periodic] Connections exist but wagmi not connected | Connections: ${connections.length} | Wagmi: ${status} | Modal: ${connectModalOpen}`);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [connectModalOpen, isConnected, address, status, connector, connections]);

  useEffect(() => {
    const unwatch = watchAccount(config, {
      onChange(data, prevData) {
        console.log(`${LOG_PREFIX} watchAccount: ${prevData.status}(${prevData.address || 'none'}) -> ${data.status}(${data.address || 'none'}) | Connector: ${data.connector?.id || 'none'} | Modal: ${connectModalOpen}`);

        if (connectModalOpen && data.status === 'connected' && data.address) {
          console.warn(`${LOG_PREFIX} ⚠️ watchAccount: Connected but modal open | Address: ${data.address} | Connector: ${data.connector?.id}`);
        }
      },
    });

    return () => {
      unwatch();
    };
  }, [config, connectModalOpen]);

  useEffect(() => {
    if (connections.length > 0) {
      console.log(`${LOG_PREFIX} Connections changed: ${connections.length} | Types: ${connections.map(c => c.connector.type).join(',')} | Wagmi status: ${status}`);
    }
  }, [connections, status]);

  return null;
};

export const RainwbowKitWrapper: React.FC<RainwbowKitWrapperProps> = ({ children }) => {
  const { language } = useTranslation();

  return (
    <RainbowKitProvider
      locale={language.bcp47Tag as Locale}
      appInfo={{
        appName: 'Venus',
      }}
      theme={rkTheme}
    >
      <WalletStateWatcher />
      {children}
    </RainbowKitProvider>
  );
};
