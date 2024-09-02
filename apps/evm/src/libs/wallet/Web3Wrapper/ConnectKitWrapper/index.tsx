import { ConnectKitProvider } from 'connectkit';
import { useChainId } from 'libs/wallet';
import { theme } from 'theme';
import { AuthHandler } from './AuthHandler';

export interface ConnectKitWrapperProps {
  children?: React.ReactNode;
}

export const ConnectKitWrapper: React.FC<ConnectKitWrapperProps> = ({ children }) => {
  const { chainId } = useChainId();

  return (
    <ConnectKitProvider
      options={{
        language: 'en-US',
        hideQuestionMarkCTA: true,
        hideRecentBadge: true,
        hideNoWalletCTA: true,
        hideTooltips: true,
        hideBalance: true,
        initialChainId: chainId,
      }}
      mode="dark"
      customTheme={{
        '--ck-font-family': '"Proxima Nova Rg", var(--font-fallback)',
        '--ck-border-radius': '0.75rem',
        '--ck-overlay-background': 'rgba(0, 0, 0, 0.5)',
        '--ck-primary-button-border-radius': '0.5rem',
        '--ck-primary-button-hover-border-radius': '0.5rem',
        '--ck-primary-button-active-border-radius': '0.5rem',
        '--ck-primary-button-background': theme.colors.lightGrey,
        '--ck-primary-button-hover-background': theme.colors.grey,
        '--ck-primary-button-active-background': theme.colors.grey,
        '--ck-secondary-button-border-radius': '0.5rem',
        '--ck-secondary-button-hover-border-radius': '0.5rem',
        '--ck-secondary-button-active-border-radius': '0.5rem',
        '--ck-secondary-button-background': theme.colors.lightGrey,
        '--ck-secondary-button-hover-background': theme.colors.grey,
        '--ck-secondary-button-active-background': theme.colors.grey,
        '--ck-body-action-color': theme.colors.grey,
        '--ck-body-background-secondary': theme.colors.cards,
        '--ck-tooltip-background': theme.colors.blue,
        '--ck-tooltip-color': theme.colors.offWhite,
        '--ck-body-color-muted': theme.colors.grey,
        '--ck-body-color': theme.colors.offWhite,
        '--ck-body-background-tertiary': theme.colors.lightGrey,
        '--ck-body-background': theme.colors.cards,
      }}
    >
      <AuthHandler />

      {children}
    </ConnectKitProvider>
  );
};
