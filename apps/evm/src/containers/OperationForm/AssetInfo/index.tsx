import BigNumber from 'bignumber.js';
import {
  Icon,
  LabeledInlineContent,
  type LabeledInlineContentProps,
  SecondaryAccordion,
  Tooltip,
  ValueUpdate,
} from 'components';
import { useGetHypotheticalUserPrimeApys } from 'hooks/useGetHypotheticalUserPrimeApys';
import { useTranslation } from 'libs/translations';
import { useMemo } from 'react';
import type { Asset, Swap, TokenAction } from 'types';
import {
  formatPercentageToReadableValue,
  getCombinedDistributionApys,
  getSwapToTokenAmountReceivedTokens,
} from 'utilities';

export interface AssetInfoProps {
  asset: Asset;
  action: TokenAction;
  amountTokens?: BigNumber;
  isUsingSwap?: boolean;
  swap?: Swap;
  renderType?: 'block' | 'accordion';
}

export const AssetInfo: React.FC<AssetInfoProps> = ({
  asset,
  action,
  swap,
  isUsingSwap = false,
  amountTokens = new BigNumber(0),
  renderType = 'block',
}) => {
  const { t } = useTranslation();

  const toTokenAmountTokens = useMemo(() => {
    if (isUsingSwap) {
      return (
        getSwapToTokenAmountReceivedTokens(swap)?.swapToTokenAmountReceivedTokens ??
        new BigNumber(0)
      );
    }

    return amountTokens;
  }, [swap, amountTokens, isUsingSwap]);

  const hypotheticalUserPrimeApys = useGetHypotheticalUserPrimeApys({
    asset,
    action,
    toTokenAmountTokens,
  });

  const { totalBorrowApyPercentage, totalSupplyApyPercentage } = useMemo(() => {
    const combinedDistributionApys = getCombinedDistributionApys({
      asset,
    });

    let tempTotalDistributionBorrowApyPercentage =
      combinedDistributionApys.totalBorrowApyPercentage;

    if (hypotheticalUserPrimeApys.borrowApy) {
      tempTotalDistributionBorrowApyPercentage = tempTotalDistributionBorrowApyPercentage
        .minus(combinedDistributionApys.borrowApyPrimePercentage || 0)
        .plus(hypotheticalUserPrimeApys.borrowApy);
    }

    let tempTotalDistributionSupplyApyPercentage =
      combinedDistributionApys.totalSupplyApyPercentage;
    if (hypotheticalUserPrimeApys.supplyApy) {
      tempTotalDistributionSupplyApyPercentage = tempTotalDistributionSupplyApyPercentage
        .minus(combinedDistributionApys.supplyApyPrimePercentage || 0)
        .plus(hypotheticalUserPrimeApys.supplyApy);
    }

    return {
      totalBorrowApyPercentage: asset.borrowApyPercentage.minus(
        tempTotalDistributionBorrowApyPercentage,
      ),
      totalSupplyApyPercentage: asset.supplyApyPercentage.plus(
        tempTotalDistributionSupplyApyPercentage,
      ),
    };
  }, [asset, hypotheticalUserPrimeApys]);

  const rows = useMemo(() => {
    const apyBreakdownRows: LabeledInlineContentProps[] = [
      {
        label:
          action === 'borrow' || action === 'repay'
            ? t('assetInfo.borrowApy')
            : t('assetInfo.supplyApy'),
        iconSrc: asset.vToken.underlyingToken,
        children: formatPercentageToReadableValue(
          action === 'borrow' || action === 'repay'
            ? asset.borrowApyPercentage
            : asset.supplyApyPercentage,
        ),
      },
    ];

    const distributionRows = (
      action === 'borrow' || action === 'repay'
        ? asset.borrowDistributions
        : asset.supplyDistributions
    )
      .filter(distribution => distribution.type !== 'primeSimulation')
      .reduce<LabeledInlineContentProps[]>((acc, distribution) => {
        if (distribution.type !== 'prime' && distribution.apyPercentage.isEqualTo(0)) {
          return acc;
        }

        const children =
          distribution.type === 'prime' ? (
            <ValueUpdate
              original={distribution.apyPercentage}
              update={
                action === 'borrow' || action === 'repay'
                  ? hypotheticalUserPrimeApys.borrowApy
                  : hypotheticalUserPrimeApys.supplyApy
              }
              format={formatPercentageToReadableValue}
            />
          ) : (
            formatPercentageToReadableValue(distribution.apyPercentage)
          );

        const row: LabeledInlineContentProps = {
          label:
            distribution.type === 'prime'
              ? t('assetInfo.primeApy', { tokenSymbol: distribution.token.symbol })
              : t('assetInfo.distributionApy', { tokenSymbol: distribution.token.symbol }),
          iconSrc: distribution.token,
          tooltip:
            distribution.type === 'rewardDistributor'
              ? t('assetInfo.distributionTooltip')
              : undefined,
          children,
        };

        return [...acc, row];
      }, []);

    return apyBreakdownRows.concat(distributionRows);
  }, [asset, action, t, hypotheticalUserPrimeApys]);

  if (renderType === 'block') {
    return (
      <div className="space-y-2">
        {rows.map(row => (
          <LabeledInlineContent {...row} key={row.label} />
        ))}

        <LabeledInlineContent
          tooltip={
            action === 'borrow' || action === 'repay'
              ? t('assetInfo.totalApy.borrowApyTooltip')
              : t('assetInfo.totalApy.supplyApyTooltip')
          }
          label={t('assetInfo.totalApy.label')}
        >
          {formatPercentageToReadableValue(
            action === 'borrow' || action === 'repay'
              ? totalBorrowApyPercentage
              : totalSupplyApyPercentage,
          )}
        </LabeledInlineContent>
      </div>
    );
  }

  return (
    <SecondaryAccordion
      title={
        <div className="flex items-center gap-x-2">
          <p className="text-sm md:text-base">{t('assetInfo.totalApy.label')}</p>

          <Tooltip
            className="inline-flex items-center"
            title={
              action === 'borrow' || action === 'repay'
                ? t('assetInfo.totalApy.borrowApyTooltip')
                : t('assetInfo.totalApy.supplyApyTooltip')
            }
          >
            <Icon className="cursor-help" name="info" />
          </Tooltip>
        </div>
      }
      rightLabel={formatPercentageToReadableValue(
        action === 'borrow' || action === 'repay'
          ? totalBorrowApyPercentage
          : totalSupplyApyPercentage,
      )}
    >
      <div className="space-y-2">
        {rows.map(row => (
          <LabeledInlineContent {...row} key={row.label} />
        ))}
      </div>
    </SecondaryAccordion>
  );
};
