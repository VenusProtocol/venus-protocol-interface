import BigNumber from 'bignumber.js';
import {
  Accordion,
  InfoIcon,
  LabeledInlineContent,
  type LabeledInlineContentProps,
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

  const { totalBorrowApyBoostPercentage, totalSupplyApyBoostPercentage } = useMemo(() => {
    const combinedDistributionApys = getCombinedDistributionApys({
      asset,
    });

    let tempTotalDistributionBorrowApyPercentage =
      combinedDistributionApys.totalBorrowApyBoostPercentage;

    if (hypotheticalUserPrimeApys.borrowApy) {
      tempTotalDistributionBorrowApyPercentage = tempTotalDistributionBorrowApyPercentage
        .minus(combinedDistributionApys.borrowApyPrimePercentage)
        .plus(hypotheticalUserPrimeApys.borrowApy);
    }

    let tempTotalDistributionSupplyApyPercentage =
      combinedDistributionApys.totalSupplyApyBoostPercentage;
    if (hypotheticalUserPrimeApys.supplyApy) {
      tempTotalDistributionSupplyApyPercentage = tempTotalDistributionSupplyApyPercentage
        .minus(combinedDistributionApys.supplyApyPrimePercentage)
        .plus(hypotheticalUserPrimeApys.supplyApy);
    }

    return {
      totalBorrowApyBoostPercentage: asset.borrowApyPercentage.minus(
        tempTotalDistributionBorrowApyPercentage,
      ),
      totalSupplyApyBoostPercentage: asset.supplyApyPercentage.plus(
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
        ? asset.borrowTokenDistributions
        : asset.supplyTokenDistributions
    )
      .filter(distribution => distribution.type !== 'primeSimulation' && distribution.isActive)
      .reduce<LabeledInlineContentProps[]>((acc, distribution) => {
        if (distribution.type !== 'prime' && distribution.apyPercentage.isEqualTo(0)) {
          return acc;
        }
        let label = t('assetInfo.distributionApy', { tokenSymbol: distribution.token.symbol });
        if (distribution.type === 'prime') {
          label = t('assetInfo.primeApy', { tokenSymbol: distribution.token.symbol });
        }
        if (distribution.type === 'merkl') {
          label = t('assetInfo.externalDistributionApy', {
            description: distribution.rewardDetails.description,
            tokenSymbol: distribution.token.symbol,
          });
        }
        const children =
          distribution.type === 'prime' ? (
            <ValueUpdate
              original={formatPercentageToReadableValue(distribution.apyPercentage)}
              update={
                action === 'borrow' || action === 'repay'
                  ? hypotheticalUserPrimeApys.borrowApy &&
                    formatPercentageToReadableValue(hypotheticalUserPrimeApys.borrowApy)
                  : hypotheticalUserPrimeApys.supplyApy &&
                    formatPercentageToReadableValue(hypotheticalUserPrimeApys.supplyApy)
              }
            />
          ) : (
            formatPercentageToReadableValue(distribution.apyPercentage)
          );

        const row: LabeledInlineContentProps = {
          label,
          iconSrc: distribution.token,
          tooltip: distribution.type === 'venus' ? t('assetInfo.distributionTooltip') : undefined,
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
              ? totalBorrowApyBoostPercentage
              : totalSupplyApyBoostPercentage,
          )}
        </LabeledInlineContent>
      </div>
    );
  }

  return (
    <Accordion
      title={
        <div className="flex items-center gap-x-2">
          <p className="text-sm md:text-base">{t('assetInfo.totalApy.label')}</p>

          <InfoIcon
            className="inline-flex items-center"
            tooltip={
              action === 'borrow' || action === 'repay'
                ? t('assetInfo.totalApy.borrowApyTooltip')
                : t('assetInfo.totalApy.supplyApyTooltip')
            }
          />
        </div>
      }
      rightLabel={formatPercentageToReadableValue(
        action === 'borrow' || action === 'repay'
          ? totalBorrowApyBoostPercentage
          : totalSupplyApyBoostPercentage,
      )}
    >
      <div className="space-y-2">
        {rows.map(row => (
          <LabeledInlineContent {...row} key={row.label} />
        ))}
      </div>
    </Accordion>
  );
};
