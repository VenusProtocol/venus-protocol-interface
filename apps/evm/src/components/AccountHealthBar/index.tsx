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

  const fillPercentage = useMemo(
    () =>
      typeof borrowBalanceCents === 'number' && typeof liquidationThresholdCents === 'number'
        ? calculatePercentage({
            numerator: borrowBalanceCents,
            denominator: liquidationThresholdCents,
          })
        : undefined,
    [borrowBalanceCents, liquidationThresholdCents],
  );

  const markPercentage = useMemo(
    () =>
      typeof borrowLimitCents === 'number' && typeof liquidationThresholdCents === 'number'
        ? calculatePercentage({
            numerator: borrowLimitCents,
            denominator: liquidationThresholdCents,
          })
        : undefined,
    [borrowLimitCents, liquidationThresholdCents],
  );

  const { readableBorrowLimitUsedPercentage, sanitizedFillPercentage } = useMemo(
    () => ({
      readableBorrowLimitUsedPercentage: formatPercentageToReadableValue(borrowLimitUsedPercentage),
      sanitizedFillPercentage: fillPercentage || 0,
    }),
    [borrowLimitUsedPercentage, fillPercentage],
  );

  const readableBorrowLimit = useMemo(
    () =>
      formatCentsToReadableValue({
        value: borrowLimitCents,
      }),
    [borrowLimitCents],
  );

  const readableLiquidationThreshold = useMemo(
    () =>
      formatCentsToReadableValue({
        value: liquidationThresholdCents,
      }),
    [liquidationThresholdCents],
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
        greyRightText={t(isSmDown ? 'accountHealth.liquidationThresholdShort' : 'accountHealth.liquidationThreshold')}
        whiteRightText={readableLiquidationThreshold}
        rightInfoTooltip={
          <Trans
            i18nKey="accountHealth.liquidationThresholdTooltip"
            components={{
              LineBreak: <br />,
              Link: (
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
          { value: 80, color: theme.colors.red },
          { value: markPercentage ?? 0, color: theme.colors.yellow },
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
