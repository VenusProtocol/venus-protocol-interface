/** @jsxImportSource @emotion/react */
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
import { LabeledProgressBar } from '../LabeledProgressBar';

const safeBorrowLimitPercentage = 100 / HEALTH_FACTOR_SAFE_THRESHOLD;
const moderateBorrowLimitPercentage = 100 / HEALTH_FACTOR_MODERATE_THRESHOLD;

export interface AccountHealthBarProps {
  borrowBalanceCents: number | undefined;
  borrowBalanceProtectedCents: number | undefined;
  borrowLimitCents: number | undefined;
  liquidationThresholdCents: number | undefined;
  className?: string;
  hideUserBalances?: string;
}

export const AccountHealthBar: React.FC<AccountHealthBarProps> = ({
  className,
  borrowBalanceCents,
  borrowBalanceProtectedCents,
  borrowLimitCents,
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
  const sanitizedFillPercentage = fillPercentage || 0;

  const readableBorrowLimit = formatCentsToReadableValue({
    value: borrowLimitCents,
  });

  const readableLiquidationThreshold = formatCentsToReadableValue({
    value: liquidationThresholdCents,
  });

  const readableBorrowBalance = formatCentsToReadableValue({
    value: borrowBalanceCents,
  });

  const readableBorrowBalanceProtected = formatCentsToReadableValue({
    value: borrowBalanceProtectedCents,
  });

  const isProtectionModeEnabled =
    borrowBalanceProtectedCents !== undefined &&
    borrowBalanceCents !== undefined &&
    borrowBalanceProtectedCents !== borrowBalanceCents;

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
            borrowLimit: hideUserBalances ?? readableBorrowLimit,
          }}
        />
      ) : undefined,
    [
      borrowBalanceCents,
      readableBorrowBalance,
      readableBorrowBalanceProtected,
      readableBorrowLimitUsedPercentage,
      readableBorrowLimit,
      hideUserBalances,
      isProtectionModeEnabled,
      Trans,
    ],
  );

  const progressBarColor = useMemo(() => {
    if (sanitizedFillPercentage <= safeBorrowLimitPercentage) {
      return theme.colors.green;
    }

    if (sanitizedFillPercentage <= moderateBorrowLimitPercentage) {
      return theme.colors.yellow;
    }

    return theme.colors.red;
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
                  href="https://docs-v4.venus.io/guides/liquidation"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: theme.colors.blue, textDecoration: 'underline' }}
                />
              ),
            }}
          />
        }
        value={sanitizedFillPercentage}
        marks={[
          { value: 80 },
          ...(markPercentage !== undefined
            ? [{ value: Math.min(markPercentage, 99), color: theme.colors.white }]
            : []),
        ]}
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
