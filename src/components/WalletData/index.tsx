/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { VError, formatVErrorToReadableString } from 'errors';
import React from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';

import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';

import { TextButton } from '../Button';
import { Icon } from '../Icon';
import { toast } from '../Toast';
import { Tooltip } from '../Tooltip';
import { useStyles } from './styles';

export interface WalletDataProps {
  token: Token;
  walletBalanceTokens: BigNumber;
  onRevoke: () => Promise<unknown>;
  walletSpendingLimitTokens?: BigNumber;
  className?: string;
}

export const WalletData: React.FC<WalletDataProps> = ({
  walletSpendingLimitTokens,
  walletBalanceTokens,
  token,
  onRevoke,
  ...otherContainerProps
}) => {
  const { Trans, t } = useTranslation();
  const styles = useStyles();

  const handleRevoke = async () => {
    try {
      await onRevoke();
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

  const readableWalletBalance = useFormatTokensToReadableValue({
    value: walletBalanceTokens,
    token,
  });

  const readableWalletSpendingLimit = useFormatTokensToReadableValue({
    value: walletSpendingLimitTokens,
    token,
  });

  // Only display component if spending limit is smaller than user balance
  const shouldDisplayWalletSpendingLimit =
    !token.isNative &&
    walletSpendingLimitTokens &&
    walletSpendingLimitTokens.isGreaterThan(0) &&
    walletSpendingLimitTokens.isLessThan(walletBalanceTokens);

  return (
    <div css={styles.container} {...otherContainerProps}>
      <div css={styles.row}>
        <Typography component="span" css={styles.label} variant="body1">
          <Trans
            i18nKey="walletData.walletBalance"
            components={{
              White: <span css={styles.whiteText} />,
            }}
            values={{ walletBalance: readableWalletBalance }}
          />
        </Typography>
      </div>

      {shouldDisplayWalletSpendingLimit && (
        <div css={styles.row}>
          <div css={styles.column}>
            <Typography component="span" css={styles.label} variant="body1">
              <Trans
                i18nKey="walletData.walletSpendingLimit.label"
                components={{
                  White: <span css={styles.whiteText} />,
                }}
                values={{ limit: readableWalletSpendingLimit }}
              />
            </Typography>

            <Tooltip css={styles.tooltip} title={t('walletData.walletSpendingLimit.labelTooltip')}>
              <Icon css={styles.infoIcon} name="info" />
            </Tooltip>
          </div>

          <TextButton onClick={handleRevoke} css={styles.button}>
            <Icon name="circledMinus" />
            {t('walletData.walletSpendingLimitRevokeButtonLabel')}
          </TextButton>
        </div>
      )}
    </div>
  );
};
