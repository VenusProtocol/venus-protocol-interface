import {
  type Locale,
  RainbowKitProvider,
  type Theme,
  darkTheme,
  useConnectModal,
} from '@rainbow-me/rainbowkit';
import { theme } from '@venusprotocol/ui';
import { reconnect as wagmiReconnect } from '@wagmi/core';
import { merge } from 'lodash-es';
import { type PropsWithChildren, useEffect, useRef } from 'react';
import { useAccount, useConfig } from 'wagmi';

import '@rainbow-me/rainbowkit/styles.css';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet/hooks/useChainId';

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

const ConnectionRecovery: React.FC = () => {
  const config = useConfig();
  const { connectModalOpen } = useConnectModal();
  const { status } = useAccount();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!connectModalOpen || status !== 'connecting') {
      clearTimeout(timerRef.current);
      return;
    }

    timerRef.current = setTimeout(async () => {
      await wagmiReconnect(config);
    }, 5000);

    return () => clearTimeout(timerRef.current);
  }, [connectModalOpen, status, config]);

  return null;
};

export const RainwbowKitWrapper: React.FC<RainwbowKitWrapperProps> = ({ children }) => {
  const { language } = useTranslation();
  // Connect the wallet on the app's current chain (from the URL) instead of
  // letting RainbowKit default to the first configured chain. Without this the
  // Binance connector always initialises its session on chains[0] (BSC), so
  // connecting while on another chain (e.g. Ethereum) would only work on BSC.
  const { chainId } = useChainId();

  return (
    <RainbowKitProvider
      initialChain={chainId}
      locale={language.bcp47Tag as Locale}
      appInfo={{
        appName: 'Venus',
      }}
      theme={rkTheme}
    >
      <ConnectionRecovery />
      {children}
    </RainbowKitProvider>
  );
};
