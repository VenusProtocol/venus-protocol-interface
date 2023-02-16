/** @jsxImportSource @emotion/react */
import { NoticeWarning } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';

import { TOKENS } from 'constants/tokens';

import { useStyles } from './styles';

export interface AnnouncementProps {
  token: Token;
}

const Announcement: React.FC<AnnouncementProps> = ({ token }) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();

  // SXP disabling
  if (token.address.toLowerCase() === TOKENS.sxp.address.toLowerCase()) {
    return (
      <NoticeWarning
        css={styles.banner}
        description={t('dashboard.modals.announcement.sxpDisablingBanner.description')}
      />
    );
  }

  // TRX migration
  if (token.address.toLowerCase() === TOKENS.xrp.address.toLowerCase()) {
    return (
      <NoticeWarning
        css={styles.banner}
        description={
          <Trans
            i18nKey="dashboard.trxMigrationBanner.description"
            components={{
              Link: (
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                <a
                  href="https://trondao.medium.com/a-step-by-step-guide-to-migrating-binance-peg-trx-to-bttc-bridged-version-trx-1cae214b7c1d"
                  rel="noreferrer"
                />
              ),
            }}
          />
        }
      />
    );
  }

  return null;
};

export default Announcement;
