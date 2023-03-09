/** @jsxImportSource @emotion/react */
import { NoticeWarning } from 'components';
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'translation';
import { Token } from 'types';

import { BUSD_DISABLING_VIP_ID } from 'constants/busdDisablingProposalId';
import Path from 'constants/path';
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

  // BUSD disabling
  if (token.address.toLowerCase() === TOKENS.busd.address.toLowerCase()) {
    return (
      <NoticeWarning
        css={styles.banner}
        description={
          <Trans
            i18nKey="dashboard.busdDisablingBanner.description"
            components={{
              Link: (
                <Link to={Path.GOVERNANCE_PROPOSAL_DETAILS.replace(':id', BUSD_DISABLING_VIP_ID)} />
              ),
            }}
          />
        }
      />
    );
  }

  // TRX migration
  if (token.address.toLowerCase() === TOKENS.trxold.address.toLowerCase()) {
    return (
      <NoticeWarning
        css={styles.banner}
        description={
          <Trans
            i18nKey="dashboard.modals.announcement.trxMigrationBanner.description"
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

export default Announcement;
