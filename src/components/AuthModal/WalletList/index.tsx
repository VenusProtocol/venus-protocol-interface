/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import config from 'config';
import { VError, formatVErrorToReadableString } from 'errors';
import React from 'react';
import { useTranslation } from 'translation';

import { Connector } from 'clients/web3/types';

import { toast } from '../../Toast';
import { INTEGRATED_WALLETS, UPCOMING_WALLETS, WALLETS } from '../constants';
import { useStyles } from './styles';

export interface WalletListProps {
  onLogin: (connector: Connector) => Promise<void>;
}

export const WalletList: React.FC<WalletListProps> = ({ onLogin }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const handleLogin = async (connector: Connector) => {
    try {
      await onLogin(connector);
    } catch (error) {
      let { message } = error as Error;

      if (error instanceof VError) {
        message = formatVErrorToReadableString(error);
      }

      toast.error({
        message,
      });
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
              onClick={() => handleLogin(connector)}
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
