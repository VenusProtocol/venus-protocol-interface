/** @jsxImportSource @emotion/react */
import { useMemo } from 'react';

import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { useTranslation } from 'libs/translations';
import {
  calculatePercentage,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
} from 'utilities';

import { theme } from '@venusprotocol/ui';
import {
  HEALTH_FACTOR_MODERATE_THRESHOLD,
  HEALTH_FACTOR_SAFE_THRESHOLD,
} from 'constants/healthFactor';
import { LabeledProgressBar } from '../LabeledProgressBar';

const safeBorrowLimitPercentage = 100 / HEALTH_FACTOR_SAFE_THRESHOLD;
const moderateBorrowLimitPercentage = 100 / HEALTH_FACTOR_MODERATE_THRESHOLD;

export interface AccountHealthBarProps {
  borrowBalanceCents: number | undefined;
  borrowLimitCents: number | undefined;
  className?: string;
}

export const AccountHealthBar: React.FC<AccountHealthBarProps> = ({
  className,
  borrowBalanceCents,
  borrowLimitCents,
}) => {
  const { t, Trans } = useTranslation();

  const borrowLimitUsedPercentage = useMemo(
    () =>
      typeof borrowBalanceCents === 'number' && typeof borrowLimitCents === 'number'
        ? calculatePercentage({
            numerator: borrowBalanceCents,
            denominator: borrowLimitCents,
          })
        : undefined,
    [borrowBalanceCents, borrowLimitCents],
  );

  const { readableBorrowLimitUsedPercentage, sanitizedBorrowLimitUsedPercentage } = useMemo(
    () => ({
      readableBorrowLimitUsedPercentage: formatPercentageToReadableValue(borrowLimitUsedPercentage),
      sanitizedBorrowLimitUsedPercentage: borrowLimitUsedPercentage || 0,
    }),
    [borrowLimitUsedPercentage],
  );

  const readableModerateBorrowLimit = useMemo(() => {
    const moderateBorrowLimitCents =
      typeof borrowLimitCents === 'number'
        ? Math.floor((borrowLimitCents * moderateBorrowLimitPercentage) / 100)
        : undefined;

    return formatCentsToReadableValue({
      value: moderateBorrowLimitCents,
    });
  }, [borrowLimitCents]);

  const readableBorrowLimit = useMemo(
    () =>
      formatCentsToReadableValue({
        value: borrowLimitCents,
      }),
    [borrowLimitCents],
  );

  const readableBorrowBalance = useMemo(
    () =>
      formatCentsToReadableValue({
        value: borrowBalanceCents,
      }),
    [borrowBalanceCents],
  );

  const tooltip = useMemo(
    () =>
      readableBorrowBalance !== PLACEHOLDER_KEY &&
      readableBorrowLimitUsedPercentage !== PLACEHOLDER_KEY &&
      readableModerateBorrowLimit !== PLACEHOLDER_KEY &&
      borrowBalanceCents &&
      borrowBalanceCents > 0 ? (
        <Trans
          i18nKey="accountHealth.tooltip"
          components={{
            LineBreak: <br />,
          }}
          values={{
            borrowBalance: readableBorrowBalance,
            borrowLimitUsedPercentage: readableBorrowLimitUsedPercentage,
            safeBorrowLimit: readableModerateBorrowLimit,
            safeBorrowLimitPercentage: moderateBorrowLimitPercentage,
          }}
        />
      ) : undefined,
    [
      readableModerateBorrowLimit,
      borrowBalanceCents,
      readableBorrowBalance,
      readableBorrowLimitUsedPercentage,
      Trans,
    ],
  );

  const progressBarColor = useMemo(() => {
    if (sanitizedBorrowLimitUsedPercentage <= safeBorrowLimitPercentage) {
      return theme.colors.green;
    }

    if (sanitizedBorrowLimitUsedPercentage <= moderateBorrowLimitPercentage) {
      return theme.colors.yellow;
    }

    return theme.colors.red;
  }, [sanitizedBorrowLimitUsedPercentage]);

  return (
    <div className={className}>
      <LabeledProgressBar
        greyLeftText={t('accountHealth.borrowLimitUsed')}
        whiteLeftText={readableBorrowLimitUsedPercentage}
        greyRightText={t('accountHealth.limit')}
        whiteRightText={readableBorrowLimit}
        value={sanitizedBorrowLimitUsedPercentage}
        mark={moderateBorrowLimitPercentage}
        step={1}
        ariaLabel={t('accountHealth.accessibilityLabel')}
        min={0}
        max={100}
        progressBarColor={progressBarColor}
        tooltip={tooltip}
      />
    </div>
  );
};
