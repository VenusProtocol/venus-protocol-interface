/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import config from 'config';
import React from 'react';
import { useTranslation } from 'translation';

import { Connector } from 'clients/web3/types';

import {
  INTEGRATED_WALLETS,
  UPCOMING_WALLETS,
  VENUS_TERMS_OF_SERVICE_URL,
  WALLETS,
} from '../constants';
import { useStyles } from './styles';

export interface WalletListProps {
  onLogin: (connector: Connector) => void;
}

export const WalletList: React.FC<WalletListProps> = ({ onLogin }) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();

  return (
    <div css={styles.container}>
      <div css={styles.walletList}>
        {WALLETS.filter(({ mainnetOnly }) => !mainnetOnly || !config.isOnTestnet).map(
          ({ name, connector, Logo }) => (
            <button
              css={styles.getListItem({ isActionable: true })}
              key={`wallet-${name}`}
              type="button"
              onClick={() => onLogin(connector)}
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

      <div css={styles.footer}>
        <Typography variant="small2">
          <Trans
            i18nKey="authModal.walletList.termsOfServiceLink"
            components={{
              Anchor: (
                <a // eslint-disable-line jsx-a11y/anchor-has-content
                  href={VENUS_TERMS_OF_SERVICE_URL}
                  target="_blank"
                  rel="noreferrer"
                  css={styles.footerLink}
                />
              ),
            }}
          />
        </Typography>
      </div>
    </div>
  );
};
