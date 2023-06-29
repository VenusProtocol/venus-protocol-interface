/** @jsxImportSource @emotion/react */
import React from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';
import { areTokensEqual } from 'utilities';

import { MAINNET_TOKENS } from 'constants/tokens';

import { NoticeInfo, NoticeWarning } from '../Notice';

export interface TokenAnnouncementProps {
  token: Token;
  className?: string;
}

export const TokenAnnouncement: React.FC<TokenAnnouncementProps> = ({ token, className }) => {
  const { Trans, t } = useTranslation();

  // TUSD migration
  if (areTokensEqual(token, MAINNET_TOKENS.tusdold)) {
    return (
      <NoticeInfo
        css={className}
        description={
          <Trans
            i18nKey="announcements.tusdMigration.description"
            components={{
              Link: (
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                <a
                  href="https://www.binance.com/en/support/announcement/binance-will-support-the-trueusd-tusd-contract-swap-52b29fadf71542afabf23acf3454f9c7"
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

  // TRX migration
  if (areTokensEqual(token, MAINNET_TOKENS.trxold)) {
    return (
      <NoticeWarning
        css={className}
        description={
          <Trans
            i18nKey="announcements.trxMigration.description"
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

  // SXP disabling
  if (areTokensEqual(token, MAINNET_TOKENS.sxp)) {
    return (
      <NoticeWarning css={className} description={t('announcements.sxpDisabling.description')} />
    );
  }

  // BETH update
  if (areTokensEqual(token, MAINNET_TOKENS.beth)) {
    return (
      <NoticeWarning
        css={className}
        description={
          <Trans
            i18nKey="announcements.bethUpdate.description"
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
