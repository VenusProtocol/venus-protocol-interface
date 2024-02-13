/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';

import config from 'config';
import { displayMutationError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { Connector } from 'libs/wallet/types';

import { INTEGRATED_WALLETS, UPCOMING_WALLETS, WALLETS } from '../constants';
import { useStyles } from './styles';

export interface WalletListProps {
  onLogIn: (connector: Connector) => Promise<void>;
}

export const WalletList: React.FC<WalletListProps> = ({ onLogIn }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const handleLogIn = async (connector: Connector) => {
    try {
      await onLogIn(connector);
    } catch (error) {
      displayMutationError({ error });
    }
  };

  return (
    <div css={styles.container}>
      <div css={styles.walletList}>
        {WALLETS.filter(({ mainnetOnly }) => !mainnetOnly || !config.isOnTestnet).map(
          ({ name, connector, Logo }) => (
            <button
              css={styles.getListItem({ isActionable: true })}
              key={`wallet-${name}`}
              type="button"
              onClick={() => handleLogIn(connector)}
            >
              <Logo css={styles.walletLogo} />

              <Typography variant="tiny" component="div">
                {name}
              </Typography>
            </button>
          ),
        )}

        {INTEGRATED_WALLETS.map(({ name, Logo, linkUrl }) => (
          <a
            css={styles.getListItem({ isActionable: true })}
            key={`wallet-${name}`}
            href={linkUrl}
            target="_blank"
            rel="noreferrer"
          >
            <Logo css={styles.walletLogo} />

            <Typography variant="tiny" component="div">
              {name}
            </Typography>
          </a>
        ))}

        {UPCOMING_WALLETS.map(({ name, Logo }) => (
          <div css={styles.getListItem({ isActionable: false })} key={`upcoming-wallet-${name}`}>
            <Logo css={styles.walletLogo} />

            <Typography variant="tiny" css={styles.comingSoonText} component="div">
              {t('authModal.walletList.comingSoon')}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};
