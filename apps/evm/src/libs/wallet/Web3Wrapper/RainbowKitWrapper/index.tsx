import { type Locale, RainbowKitProvider, type Theme, darkTheme } from '@rainbow-me/rainbowkit';
import { theme } from '@venusprotocol/ui';
import { watchAccount } from '@wagmi/core';
import merge from 'lodash.merge';
import { useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import { useAccount, useConfig } from 'wagmi';
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

  useEffect(() => {
    console.log(`${LOG_PREFIX} WalletStateWatcher initialized, starting to watch account changes`);

    const unwatch = watchAccount(config, {
      onChange(data, prevData) {
        console.log(`${LOG_PREFIX} watchAccount onChange triggered:`, {
          previous: {
            status: prevData.status,
            address: prevData.address,
            isConnected: prevData.isConnected,
            connectorId: prevData.connector?.id,
            connectorType: prevData.connector?.type,
          },
          current: {
            status: data.status,
            address: data.address,
            isConnected: data.isConnected,
            connectorId: data.connector?.id,
            connectorType: data.connector?.type,
            connectorName: data.connector?.name,
          },
          modalOpen: connectModalOpen,
          timestamp: new Date().toISOString(),
        });

        if (connectModalOpen && data.status === 'connected' && data.address) {
          console.warn(`${LOG_PREFIX} ⚠️ watchAccount detected sync issue:`, {
            message: 'Account is connected but modal is still open',
            accountStatus: data.status,
            accountAddress: data.address,
            modalOpen: connectModalOpen,
            connectorId: data.connector?.id,
            connectorType: data.connector?.type,
            timestamp: new Date().toISOString(),
          });
        }
      },
    });

    return () => {
      console.log(`${LOG_PREFIX} WalletStateWatcher cleanup, unwatching account changes`);
      unwatch();
    };
  }, [config, connectModalOpen]);

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
