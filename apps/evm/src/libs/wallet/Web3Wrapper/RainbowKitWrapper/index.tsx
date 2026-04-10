import { type Locale, RainbowKitProvider, type Theme, darkTheme } from '@rainbow-me/rainbowkit';
import { theme } from '@venusprotocol/ui';
import merge from 'lodash.merge';
import type { PropsWithChildren } from 'react';

import '@rainbow-me/rainbowkit/styles.css';
import { useTranslation } from 'libs/translations';

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
      {children}
    </RainbowKitProvider>
  );
};
