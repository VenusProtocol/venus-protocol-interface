import {
  type Locale,
  RainbowKitProvider,
  type Theme,
  darkTheme,
  useConnectModal,
} from '@rainbow-me/rainbowkit';
import { theme } from '@venusprotocol/ui';
import { reconnect as wagmiReconnect } from '@wagmi/core';
import merge from 'lodash.merge';
import { type PropsWithChildren, useEffect, useRef } from 'react';
import { useAccount, useConfig } from 'wagmi';

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

/**
 * Detects when wagmi gets stuck in "connecting" status (known issue with
 * WalletConnect connector reusing a stale provider after disconnect) and
 * recovers by calling reconnect() which re-reads the actual provider state.
 */
const StuckConnectionRecovery: React.FC = () => {
  const config = useConfig();
  const { connectModalOpen } = useConnectModal();
  const { status } = useAccount();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    // Only act when modal is open and wagmi is stuck in "connecting"
    if (!connectModalOpen || status !== 'connecting') {
      clearTimeout(timerRef.current);
      return;
    }

    // If still "connecting" after 5s, the connector.connect() Promise likely
    // hung due to stale WalletConnect provider. Call reconnect() once to sync.
    timerRef.current = setTimeout(async () => {
      console.log(`${LOG_PREFIX} stuck in connecting for 5s, attempting reconnect`);
      const connections = await wagmiReconnect(config);
      console.log(
        `${LOG_PREFIX} reconnect result: ${connections.length} connections recovered`,
      );
    }, 5000);

    return () => clearTimeout(timerRef.current);
  }, [connectModalOpen, status, config]);

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
      <StuckConnectionRecovery />
      {children}
    </RainbowKitProvider>
  );
};
