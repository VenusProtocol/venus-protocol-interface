/** @jsxImportSource @emotion/react */
import React from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';
import { areTokensEqual } from 'utilities';

import { MAINNET_TOKENS } from 'constants/tokens';

import { NoticeWarning } from '../Notice';
import { useStyles } from './styles';

export interface AnnouncementProps {
  token: Token;
}

export const Announcement: React.FC<AnnouncementProps> = ({ token }) => {
  const styles = useStyles();
  const { Trans, t } = useTranslation();

  // SXP disabling
  if (areTokensEqual(token, MAINNET_TOKENS.sxp)) {
    return (
      <NoticeWarning
        css={styles.banner}
        description={t('dashboard.modals.announcement.sxpDisablingBanner.description')}
      />
    );
  }

  // BETH update
  if (areTokensEqual(token, MAINNET_TOKENS.beth)) {
    return (
      <NoticeWarning
        css={styles.banner}
        description={
          <Trans
            i18nKey="announcements.bethUpdateBanner.description"
            components={{
              Link: (
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                <a
                  href="https://binance.com/en/support/announcement/binance-introduces-wrapped-beacon-eth-wbeth-on-eth-staking-a1197f34d832445db41654ad01f56b4d"
                  rel="noreferrer"
                  target="_blank"
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
