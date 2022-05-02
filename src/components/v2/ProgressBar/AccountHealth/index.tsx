/** @jsxImportSource @emotion/react */
import React from 'react';

import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { formatCentsToReadableValue, formatToReadablePercentage } from 'utilities/common';
import calculatePercentage from 'utilities/calculatePercentage';
import { useTranslation } from 'translation';
import { LabeledProgressBar } from '../LabeledProgressBar';

export interface IAccountHealthProps {
  borrowBalanceCents: number | undefined;
  borrowLimitCents: number | undefined;
  safeBorrowLimitPercentage: number;
  hypotheticalBorrowBalanceCents?: number;
  variant?: 'borrowBalance' | 'borrowLimitUsed';
  className?: string;
}

export const AccountHealth: React.FC<IAccountHealthProps> = ({
  className,
  borrowBalanceCents,
  borrowLimitCents,
  variant = 'borrowBalance',
  hypotheticalBorrowBalanceCents,
  safeBorrowLimitPercentage,
}) => {
  const { t, Trans } = useTranslation();

  const borrowLimitUsedPercentage =
    typeof borrowBalanceCents === 'number' && typeof borrowLimitCents === 'number'
      ? calculatePercentage({
          numerator: borrowBalanceCents,
          denominator: borrowLimitCents,
        })
      : undefined;

  const hypotheticalBorrowLimitUsedPercentage =
    typeof hypotheticalBorrowBalanceCents === 'number' && typeof borrowLimitCents === 'number'
      ? calculatePercentage({
          numerator: hypotheticalBorrowBalanceCents,
          denominator: borrowLimitCents,
        })
      : undefined;

  const readableBorrowLimitUsedPercentage = formatToReadablePercentage(borrowLimitUsedPercentage);

  const safeBorrowLimitCents =
    typeof borrowLimitCents === 'number'
      ? Math.floor((borrowLimitCents * safeBorrowLimitPercentage) / 100)
      : undefined;

  const readableSafeBorrowLimit = formatCentsToReadableValue({
    value: safeBorrowLimitCents,
  });

  const readableBorrowLimit = formatCentsToReadableValue({
    value: borrowLimitCents,
  });

  const readableBorrowBalance = formatCentsToReadableValue({
    value: borrowBalanceCents,
  });

  return (
    <div className={className}>
      <LabeledProgressBar
        greyLeftText={
          variant === 'borrowBalance'
            ? t('accountHealth.currentBorrowBalance')
            : t('accountHealth.borrowLimitUsed')
        }
        whiteLeftText={
          variant === 'borrowBalance' ? readableBorrowBalance : readableBorrowLimitUsedPercentage
        }
        greyRightText={
          variant === 'borrowBalance' ? t('accountHealth.max') : t('accountHealth.limit')
        }
        whiteRightText={readableBorrowLimit}
        value={borrowLimitUsedPercentage || 0}
        secondaryValue={hypotheticalBorrowLimitUsedPercentage}
        mark={safeBorrowLimitPercentage}
        step={1}
        ariaLabel={t('accountHealth.accessibilityLabel')}
        min={0}
        max={100}
        trackTooltip={
          readableBorrowBalance !== PLACEHOLDER_KEY &&
          readableBorrowLimitUsedPercentage !== PLACEHOLDER_KEY ? (
            <Trans
              i18nKey="accountHealth.borrowLimitTooltip"
              components={{
                LineBreak: <br />,
              }}
              values={{
                borrowBalance: readableBorrowBalance,
                borrowLimitUsedPercentage: readableBorrowLimitUsedPercentage,
              }}
            />
          ) : undefined
        }
        markTooltip={
          readableSafeBorrowLimit !== PLACEHOLDER_KEY &&
          borrowBalanceCents &&
          borrowBalanceCents > 0 ? (
            <Trans
              i18nKey="accountHealth.safeBorrowLimitTooltip"
              components={{
                LineBreak: <br />,
              }}
              values={{
                safeBorrowLimit: readableSafeBorrowLimit,
                safeBorrowLimitPercentage,
              }}
            />
          ) : undefined
        }
      />
    </div>
  );
};

export const BorrowBalanceAccountHealth = (props: IAccountHealthProps) => (
  <AccountHealth variant="borrowBalance" {...props} />
);

export const BorrowLimitUsedAccountHealth = (props: IAccountHealthProps) => (
  <AccountHealth variant="borrowLimitUsed" {...props} />
);
