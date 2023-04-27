/** @jsxImportSource @emotion/react */
import { NoticeWarning } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';

import { MAINNET_TOKENS } from 'constants/tokens';

import { useStyles } from './styles';

export interface AnnouncementProps {
  token: Token;
}

const Announcement: React.FC<AnnouncementProps> = ({ token }) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();

  // SXP disabling
  if (token.address.toLowerCase() === MAINNET_TOKENS.sxp.address.toLowerCase()) {
    return (
      <NoticeWarning
        css={styles.banner}
        description={t('dashboard.modals.announcement.sxpDisablingBanner.description')}
      />
    );
  }

  // BETH update
  if (token.address.toLowerCase() === MAINNET_TOKENS.beth.address.toLowerCase()) {
    return (
      <NoticeWarning
        css={styles.banner}
        description={
          <Trans
            i18nKey="dashboard.bethUpdateBanner.description"
            components={{
              Link: (
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                <a
                  href="https://binance.com/en/support/announcement/binance-introduces-wrapped-beacon-eth-wbeth-on-eth-staking-a1197f34d832445db41654ad01f56b4d"
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
