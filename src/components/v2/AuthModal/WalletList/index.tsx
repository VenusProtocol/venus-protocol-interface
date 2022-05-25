/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';

import { useTranslation } from 'translation';
import { Connector } from 'clients/web3';
import { VENUS_TERMS_OF_SERVICE_URL, isOnTestnet } from 'config';
import { Icon } from '../../Icon';
import { WALLETS, UPCOMING_WALLETS } from '../constants';
import { useStyles } from './styles';

export interface IWalletListProps {
  onLogin: (connector: Connector) => void;
}

export const WalletList: React.FC<IWalletListProps> = ({ onLogin }) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();

  return (
    <div css={styles.container}>
      {WALLETS.filter(({ mainnetOnly }) => !mainnetOnly || !isOnTestnet).map(
        ({ name, connector, Logo }) => (
          <button
            css={styles.getListItem({ isActionable: true })}
            key={`wallet-${name}`}
            type="button"
            onClick={() => onLogin(connector)}
          >
            <Logo css={styles.walletLogo} />

            <Typography css={styles.walletName} component="span">
              {name}
            </Typography>

            <Icon name="chevronRight" css={[styles.chevronRightIcon]} />
          </button>
        ),
      )}

      <div css={styles.divider} />

      {UPCOMING_WALLETS.map(({ name, Logo }) => (
        <div css={styles.getListItem({ isActionable: false })} key={`upcoming-wallet-${name}`}>
          <Logo css={styles.walletLogo} />

          <Typography css={styles.walletName} component="span">
            {name}
          </Typography>

          <Typography css={styles.comingSoonText} component="span">
            {t('authModal.walletList.comingSoon')}
          </Typography>
        </div>
      ))}

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
