import { useMemo } from 'react';

import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { useTranslation } from 'libs/translations';
import {
  calculatePercentage,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
} from 'utilities';

import { cn, theme } from '@venusprotocol/ui';
import {
  HEALTH_FACTOR_MODERATE_THRESHOLD,
  HEALTH_FACTOR_SAFE_THRESHOLD,
} from 'constants/healthFactor';
import { VENUS_DOC_URL } from 'constants/production';
import { LabeledProgressBar } from '../LabeledProgressBar';

const safeBorrowLimitPercentage = 100 / HEALTH_FACTOR_SAFE_THRESHOLD;
const moderateBorrowLimitPercentage = 100 / HEALTH_FACTOR_MODERATE_THRESHOLD;

export interface AccountHealthBarProps {
  borrowBalanceCents: number | undefined;
  borrowBalanceProtectedCents: number | undefined;
  borrowLimitCents: number | undefined;
  borrowLimitProtectedCents: number | undefined;
  liquidationThresholdCents: number | undefined;
  className?: string;
  hideUserBalances?: string;
}

export const AccountHealthBar: React.FC<AccountHealthBarProps> = ({
  className,
  borrowBalanceCents,
  borrowBalanceProtectedCents,
  borrowLimitCents,
  borrowLimitProtectedCents,
  liquidationThresholdCents,
  hideUserBalances,
}) => {
  const { t, Trans } = useTranslation();

  const borrowLimitUsedPercentage =
    typeof borrowBalanceCents === 'number' && typeof borrowLimitCents === 'number'
      ? calculatePercentage({
          numerator: borrowBalanceCents,
          denominator: borrowLimitCents,
        })
      : undefined;

  const protectedBorrowLimitUsedPercentage =
    typeof borrowBalanceProtectedCents === 'number' && typeof borrowLimitProtectedCents === 'number'
      ? calculatePercentage({
          numerator: borrowBalanceProtectedCents,
          denominator: borrowLimitProtectedCents,
        })
      : undefined;

  const fillPercentage =
    typeof borrowBalanceCents === 'number' && typeof liquidationThresholdCents === 'number'
      ? calculatePercentage({
          numerator: borrowBalanceCents,
          denominator: liquidationThresholdCents,
        })
      : undefined;

  const markPercentage =
    typeof borrowLimitCents === 'number' && typeof liquidationThresholdCents === 'number'
      ? calculatePercentage({
          numerator: borrowLimitCents,
          denominator: liquidationThresholdCents,
        })
      : undefined;

  const readableBorrowLimitUsedPercentage =
    formatPercentageToReadableValue(borrowLimitUsedPercentage);
  const sanitizedFillPercentage = Math.min(Math.max(fillPercentage || 0, 0), 100);

  const readableBorrowBalance = formatCentsToReadableValue({
    value: borrowBalanceCents,
  });

  const readableBorrowBalanceProtected = formatCentsToReadableValue({
    value: borrowBalanceProtectedCents,
  });

  const readableBorrowLimit = formatCentsToReadableValue({
    value: borrowLimitCents,
  });

  const readableBorrowLimitProtected = formatCentsToReadableValue({
    value: borrowLimitProtectedCents,
  });

  const readableLiquidationThreshold = formatCentsToReadableValue({
    value: liquidationThresholdCents,
  });

  const isProtectionModeEnabled =
    borrowLimitUsedPercentage !== undefined &&
    protectedBorrowLimitUsedPercentage !== undefined &&
    borrowLimitUsedPercentage !== protectedBorrowLimitUsedPercentage;

  const tooltip = useMemo(
    () =>
      readableBorrowBalance !== PLACEHOLDER_KEY &&
      readableBorrowLimitUsedPercentage !== PLACEHOLDER_KEY &&
      borrowBalanceCents &&
      borrowBalanceCents > 0 ? (
        <Trans
          // Translation keys: do not remove this comment
          // t('accountHealth.tooltip')
          // t('accountHealth.tooltipProtection')
          i18nKey={
            isProtectionModeEnabled ? 'accountHealth.tooltipProtection' : 'accountHealth.tooltip'
          }
          shouldUnescape
          components={{
            LineBreak: <br />,
          }}
          values={{
            borrowBalanceProtected: hideUserBalances ?? readableBorrowBalanceProtected,
            borrowBalance: hideUserBalances ?? readableBorrowBalance,
            borrowLimitUsedPercentage: hideUserBalances ?? readableBorrowLimitUsedPercentage,
            protectedBorrowLimitUsedPercentage:
              hideUserBalances ??
              formatPercentageToReadableValue(protectedBorrowLimitUsedPercentage),
            borrowLimit: hideUserBalances ?? readableBorrowLimit,
            borrowLimitProtected: hideUserBalances ?? readableBorrowLimitProtected,
          }}
        />
      ) : undefined,
    [
      borrowBalanceCents,
      readableBorrowBalance,
      readableBorrowBalanceProtected,
      readableBorrowLimitUsedPercentage,
      protectedBorrowLimitUsedPercentage,
      readableBorrowLimit,
      readableBorrowLimitProtected,
      hideUserBalances,
      isProtectionModeEnabled,
      Trans,
    ],
  );

  const progressBarClassName = useMemo(() => {
    if (sanitizedFillPercentage <= safeBorrowLimitPercentage) {
      return 'bg-green';
    }

    if (sanitizedFillPercentage <= moderateBorrowLimitPercentage) {
      return 'bg-yellow';
    }

    return 'bg-red';
  }, [sanitizedFillPercentage]);

  return (
    <div className={cn('@container/accountHealthBar', className)}>
      <LabeledProgressBar
        greyLeftText={t('accountHealth.borrowed')}
        whiteLeftText={hideUserBalances ?? readableBorrowBalance}
        leftInfoTooltip={t('accountHealth.borrowedSpotTooltip')}
        greyRightText={
          <>
            <p className="@sm:hidden">{t('accountHealth.liquidationThresholdShort')}</p>
            <p className="hidden @sm:block">{t('accountHealth.liquidationThreshold')}</p>
          </>
        }
        whiteRightText={hideUserBalances ?? readableLiquidationThreshold}
        rightInfoTooltip={
          <Trans
            i18nKey="accountHealth.liquidationThresholdTooltip"
            components={{
              LineBreak: <br />,
              Link: (
                // biome-ignore lint/a11y/useAnchorContent: content is injected by Trans component
                <a
                  href={`${VENUS_DOC_URL}/guides/liquidation`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: theme.colors.blue, textDecoration: 'underline' }}
                />
              ),
            }}
          />
        }
        progressBars={[
          {
            value: sanitizedFillPercentage,
            className: progressBarClassName,
          },
        ]}
        marks={[
          { value: 80 },
          ...(markPercentage !== undefined
            ? [{ value: Math.min(markPercentage, 99), className: 'bg-white' }]
            : []),
        ]}
        min={0}
        max={100}
        tooltip={tooltip}
      />
    </div>
  );
};
