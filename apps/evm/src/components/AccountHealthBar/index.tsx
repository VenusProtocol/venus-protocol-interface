/** @jsxImportSource @emotion/react */
import { useMemo } from 'react';

import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { useIsSmDown } from 'hooks/responsive';
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
  liquidationThresholdCents: number | undefined;
  className?: string;
}

export const AccountHealthBar: React.FC<AccountHealthBarProps> = ({
  className,
  borrowBalanceCents,
  borrowLimitCents,
  liquidationThresholdCents,
}) => {
  const { t, Trans } = useTranslation();
  const isSmDown = useIsSmDown();

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

  const tooltip = useMemo(
    () =>
      readableBorrowBalance !== PLACEHOLDER_KEY &&
      readableBorrowLimitUsedPercentage !== PLACEHOLDER_KEY &&
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
            borrowLimit: readableBorrowLimit,
          }}
        />
      ) : undefined,
    [
      borrowBalanceCents,
      readableBorrowBalance,
      readableBorrowLimitUsedPercentage,
      readableBorrowLimit,
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
    <div className={className}>
      <LabeledProgressBar
        greyLeftText={t('accountHealth.borrowed')}
        whiteLeftText={readableBorrowBalance}
        greyRightText={
          isSmDown
            ? t('accountHealth.liquidationThresholdShort')
            : t('accountHealth.liquidationThreshold')
        }
        whiteRightText={readableLiquidationThreshold}
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
