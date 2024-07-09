/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';

import config from 'config';
import { displayMutationError } from 'libs/errors';
import { useTranslation } from 'libs/translations';

import { type ConnectorId, integratedWallets, upcomingWallets, wallets } from 'libs/wallet';
import { useStyles } from './styles';

export interface WalletListProps {
  onLogIn: (connector: ConnectorId) => Promise<void>;
}

export const WalletList: React.FC<WalletListProps> = ({ onLogIn }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const handleLogIn = async (connectorId: ConnectorId) => {
    try {
      await onLogIn(connectorId);
    } catch (error) {
      displayMutationError({ error });
    }
  };

  return (
    <div css={styles.container}>
      <div css={styles.walletList}>
        {wallets
          .filter(({ mainnetOnly }) => !mainnetOnly || !config.isOnTestnet)
          .map(({ name, connectorId, logoSrc }) => (
            <button
              css={styles.getListItem({ isActionable: true })}
              key={`wallet-${name}`}
              type="button"
              onClick={() => handleLogIn(connectorId)}
            >
              <img src={logoSrc} alt={name} css={styles.walletLogo} />

              <Typography variant="tiny" component="div">
                {name}
              </Typography>
            </button>
          ))}

        {integratedWallets.map(({ name, logoSrc, linkUrl }) => (
          <a
            css={styles.getListItem({ isActionable: true })}
            key={`wallet-${name}`}
            href={linkUrl}
            target="_blank"
            rel="noreferrer"
          >
            <img src={logoSrc} alt={name} css={styles.walletLogo} />

            <Typography variant="tiny" component="div">
              {name}
            </Typography>
          </a>
        ))}

        {upcomingWallets.map(({ name, logoSrc }) => (
          <div css={styles.getListItem({ isActionable: false })} key={`upcoming-wallet-${name}`}>
            <img src={logoSrc} alt={name} css={styles.walletLogo} />

            <Typography variant="tiny" css={styles.comingSoonText} component="div">
              {t('authModal.walletList.comingSoon')}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};
