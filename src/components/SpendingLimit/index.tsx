/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { VError, formatVErrorToReadableString } from 'errors';
import React from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';

import { LabeledInlineContent } from 'components/LabeledInlineContent';
import { Spinner } from 'components/Spinner';
import { Tooltip } from 'components/Tooltip';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';

import { TextButton } from '../Button';
import { Icon } from '../Icon';
import { toast } from '../Toast';
import { useStyles } from './styles';

export interface SpendingLimitProps {
  token: Token;
  onRevoke: () => Promise<unknown>;
  isRevokeLoading: boolean;
  walletBalanceTokens?: BigNumber;
  walletSpendingLimitTokens?: BigNumber;
  className?: string;
}

export const SpendingLimit: React.FC<SpendingLimitProps> = ({
  walletSpendingLimitTokens,
  walletBalanceTokens,
  isRevokeLoading,
  token,
  onRevoke,
  ...otherContainerProps
}) => {
  const { t } = useTranslation();
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

  const readableWalletSpendingLimit = useFormatTokensToReadableValue({
    value: walletSpendingLimitTokens,
    token,
  });

  // Only display component if spending limit is smaller than user balance
  const shouldDisplayWalletSpendingLimit =
    !token.isNative &&
    walletSpendingLimitTokens &&
    walletSpendingLimitTokens.isGreaterThan(0) &&
    walletBalanceTokens &&
    walletSpendingLimitTokens.isLessThan(walletBalanceTokens);

  if (!shouldDisplayWalletSpendingLimit) {
    return null;
  }

  return (
    <LabeledInlineContent
      label={t('spendingLimit.label')}
      tooltip={t('spendingLimit.labelTooltip')}
      {...otherContainerProps}
    >
      {isRevokeLoading ? (
        <Spinner css={styles.control} />
      ) : (
        <>
          <div>{readableWalletSpendingLimit}</div>

          <TextButton onClick={handleRevoke} css={[styles.control, styles.button]}>
            <Tooltip title={t('spendingLimit.revokeButtonTooltip')} css={styles.buttonTooltip}>
              <Icon name="bin" css={styles.buttonIcon} />
            </Tooltip>
          </TextButton>
        </>
      )}
    </LabeledInlineContent>
  );
};
