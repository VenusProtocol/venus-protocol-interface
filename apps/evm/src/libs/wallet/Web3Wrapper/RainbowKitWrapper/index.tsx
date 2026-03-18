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
import { defaultChain } from 'libs/wallet/chains';

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
  const { status, chainId, connector } = useAccount();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const prevStatusRef = useRef<string>(status);

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

  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    prevStatusRef.current = status;

    if (prevStatus === 'disconnected' && status === 'connected' && connector?.type === 'walletConnect' && chainId !== defaultChain.id) {
      window.location.reload();
    }
  }, [status, chainId, connector]);

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
      <ConnectionRecovery />
      {children}
    </RainbowKitProvider>
  );
};
