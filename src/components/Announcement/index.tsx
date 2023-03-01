/** @jsxImportSource @emotion/react */
import React from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';

import { TOKENS } from 'constants/tokens';

import { NoticeWarning } from '../Notice';
import { useStyles } from './styles';

export interface AnnouncementProps {
  token: Token;
}

export const Announcement: React.FC<AnnouncementProps> = ({ token }) => {
  const styles = useStyles();
  const { Trans } = useTranslation();

  // TRX migration
  if (token.address.toLowerCase() === TOKENS.trxold.address.toLowerCase()) {
    return (
      <NoticeWarning
        css={styles.banner}
        description={
          <Trans
            i18nKey="announcements.trxMigrationBanner.description"
            components={{
              Link: (
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                <a
                  href="https://www.binance.com/en/support/announcement/binance-will-support-the-tron-trx-contract-swap-494f53e94eb64adc8335b88f7e14006a"
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
