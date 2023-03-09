/** @jsxImportSource @emotion/react */
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'translation';
import { Token } from 'types';
import { areTokensEqual } from 'utilities';

import { BUSD_DISABLING_VIP_ID } from 'constants/busdDisablingProposalId';
import { routes } from 'constants/routing';
import { TOKENS } from 'constants/tokens';

import { NoticeWarning } from '../Notice';
import { useStyles } from './styles';

export interface AnnouncementProps {
  token: Token;
}

export const Announcement: React.FC<AnnouncementProps> = ({ token }) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();

  // SXP disabling
  if (areTokensEqual(token, TOKENS.sxp)) {
    return (
      <NoticeWarning
        css={styles.banner}
        description={t('announcement.sxpDisablingBanner.description')}
      />
    );
  }

  // TRX migration
  if (areTokensEqual(token, TOKENS.trxold)) {
    return (
      <NoticeWarning
        css={styles.banner}
        description={
          <Trans
            i18nKey="announcement.trxMigrationBanner.description"
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

  // BUSD disabling
  if (areTokensEqual(token, TOKENS.busd)) {
    return (
      <NoticeWarning
        css={styles.banner}
        description={
          <Trans
            i18nKey="announcement.busdDisablingBanner.description"
            components={{
              Link: (
                <Link to={routes.governanceProposal.path.replace(':id', BUSD_DISABLING_VIP_ID)} />
              ),
            }}
          />
        }
      />
    );
  }

  return null;
};
