/** @jsxImportSource @emotion/react */
import { cn } from '@venusprotocol/ui';

import {
  EModeIcon,
  InfoIcon,
  LayeredValues,
  ProgressBar,
  type TableColumn,
  Toggle,
  TokenIconWithSymbol,
  Tooltip,
} from 'components';
import { Apy } from 'components';
import { useTranslation } from 'libs/translations';
import { useAccountChainId, useChainId } from 'libs/wallet';
import type { Asset, EModeGroup } from 'types';
import {
  areTokensEqual,
  compareBigNumbers,
  compareBooleans,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
  getCombinedDistributionApys,
  isAssetPaused,
  isCollateralActionDisabled,
} from 'utilities';
import { useStyles } from '../styles';
import type { ColumnKey } from '../types';

// Translation keys: do not remove this comment
// t('marketTable.columnKeys.asset')
// t('marketTable.columnKeys.assetAndChain')
// t('marketTable.columnKeys.supplyApy')
// t('marketTable.columnKeys.labeledSupplyApy')
// t('marketTable.columnKeys.borrowApy')
// t('marketTable.columnKeys.labeledBorrowApy')
// t('marketTable.columnKeys.collateral')
// t('marketTable.columnKeys.supplyBalance')
// t('marketTable.columnKeys.borrowBalance')
// t('marketTable.columnKeys.userBorrowBalance')
// t('marketTable.columnKeys.userSupplyBalance')
// t('marketTable.columnKeys.userWalletBalance')
// t('marketTable.columnKeys.userBorrowLimitSharePercentage')
// t('marketTable.columnKeys.liquidity')
// t('marketTable.columnKeys.price')

// t('marketTable.columnSelectOptionLabel.asset')
// t('marketTable.columnSelectOptionLabel.supplyApy')
// t('marketTable.columnSelectOptionLabel.labeledSupplyApy')
// t('marketTable.columnSelectOptionLabel.borrowApy')
// t('marketTable.columnSelectOptionLabel.labeledBorrowApy')
// t('marketTable.columnSelectOptionLabel.collateral')
// t('marketTable.columnSelectOptionLabel.supplyBalance')
// t('marketTable.columnSelectOptionLabel.borrowBalance')
// t('marketTable.columnSelectOptionLabel.userBorrowBalance')
// t('marketTable.columnSelectOptionLabel.userSupplyBalance')
// t('marketTable.columnSelectOptionLabel.userWalletBalance')
// t('marketTable.columnSelectOptionLabel.userBorrowLimitSharePercentage')
// t('marketTable.columnSelectOptionLabel.liquidity')
// t('marketTable.columnSelectOptionLabel.price')

export const useColumns = ({
  columnKeys,
  collateralOnChange,
  userEModeGroup,
}: {
  columnKeys: ColumnKey[];
  collateralOnChange: (asset: Asset) => void;
  userEModeGroup?: EModeGroup;
}) => {
  const { t, Trans } = useTranslation();
  const styles = useStyles();
  const { chainId: accountChainId } = useAccountChainId();
  const { chainId } = useChainId();
  const isAccountOnWrongChain = accountChainId !== chainId;

  const columns: TableColumn<Asset>[] = columnKeys.map((column, index) => {
    let columnLabel: React.ReactNode | string = t(`marketTable.columnKeys.${column}`);

    if (column === 'borrowApy' || column === 'labeledBorrowApy') {
      columnLabel = (
        <Trans
          i18nKey={`marketTable.columnKeys.${column}`}
          components={{
            InfoIcon: (
              <InfoIcon
                tooltip={t('marketTable.columnTooltips.borrowApy')}
                css={styles.getColumnLabelInfoIcon({
                  hasRightMargin: column === 'labeledBorrowApy',
                })}
              />
            ),
          }}
        />
      );
    } else if (column === 'supplyApy' || column === 'labeledSupplyApy') {
      columnLabel = (
        <Trans
          i18nKey={`marketTable.columnKeys.${column}`}
          components={{
            InfoIcon: (
              <InfoIcon
                tooltip={t('marketTable.columnTooltips.supplyApy')}
                css={styles.getColumnLabelInfoIcon({
                  hasRightMargin: true,
                })}
              />
            ),
          }}
        />
      );
    }

    return {
      key: column,
      label: columnLabel,
      selectOptionLabel: t(`marketTable.columnSelectOptionLabel.${column}`),
      align: index === 0 ? 'left' : 'right',
      renderCell: asset => {
        const isInUserEModeGroup = (userEModeGroup?.assetSettings || []).some(a =>
          areTokensEqual(a.vToken, asset.vToken),
        );

        const isPaused = isAssetPaused({
          disabledTokenActions: asset.disabledTokenActions,
        });

        if (column === 'asset' || column === 'assetAndChain') {
          return (
            <div className="flex items-center space-x-2">
              <TokenIconWithSymbol
                token={asset.vToken.underlyingToken}
                displayChain={column === 'assetAndChain'}
              />

              {userEModeGroup && isInUserEModeGroup && (
                <Tooltip
                  className="inline-flex items-center"
                  content={t('marketTable.assetColumn.eMode', {
                    eModeGroupName: userEModeGroup.name,
                  })}
                >
                  <EModeIcon className="w-4 h-4" />
                </Tooltip>
              )}

              {isPaused && (
                <InfoIcon
                  iconClassName="text-orange"
                  iconName="attention"
                  tooltip={t('marketTable.assetColumn.pausedAssetTooltip')}
                />
              )}
            </div>
          );
        }

        if (
          column === 'supplyApy' ||
          column === 'borrowApy' ||
          column === 'labeledSupplyApy' ||
          column === 'labeledBorrowApy'
        ) {
          return (
            <Apy
              className={cn(isPaused && 'text-grey')}
              asset={asset}
              type={column === 'supplyApy' || column === 'labeledSupplyApy' ? 'supply' : 'borrow'}
            />
          );
        }

        if (column === 'collateral') {
          const collateralActionDisabled = isCollateralActionDisabled({
            disabledTokenActions: asset.disabledTokenActions,
            isCollateralOfUser: asset.isCollateralOfUser,
          });

          return (
            <Toggle
              className="py-1"
              onChange={() => collateralOnChange(asset)}
              value={
                asset.isCollateralOfUser && (!userEModeGroup || asset.userCollateralFactor > 0)
              }
              disabled={
                isAccountOnWrongChain ||
                collateralActionDisabled ||
                (userEModeGroup && asset.userCollateralFactor === 0)
              }
            />
          );
        }

        if (column === 'liquidity') {
          return (
            <LayeredValues
              className={cn(isPaused && 'text-grey')}
              topValue={formatTokensToReadableValue({
                value: asset.cashTokens,
                token: asset.vToken.underlyingToken,
              })}
              bottomValue={formatCentsToReadableValue({
                value: asset.liquidityCents,
              })}
            />
          );
        }

        if (column === 'userWalletBalance') {
          return (
            <LayeredValues
              className={cn(isPaused && 'text-grey')}
              topValue={formatTokensToReadableValue({
                value: asset.userWalletBalanceTokens,
                token: asset.vToken.underlyingToken,
              })}
              bottomValue={formatCentsToReadableValue({
                value: asset.userWalletBalanceCents,
              })}
            />
          );
        }

        if (column === 'userSupplyBalance') {
          return (
            <LayeredValues
              className={cn(isPaused && 'text-grey')}
              topValue={formatTokensToReadableValue({
                value: asset.userSupplyBalanceTokens,
                token: asset.vToken.underlyingToken,
              })}
              bottomValue={formatCentsToReadableValue({
                value: asset.userSupplyBalanceCents,
              })}
            />
          );
        }

        if (column === 'userBorrowBalance') {
          return (
            <LayeredValues
              className={cn(isPaused && 'text-grey')}
              topValue={formatTokensToReadableValue({
                value: asset.userBorrowBalanceTokens,
                token: asset.vToken.underlyingToken,
              })}
              bottomValue={formatCentsToReadableValue({
                value: asset.userBorrowBalanceCents,
              })}
            />
          );
        }

        if (column === 'supplyBalance') {
          return (
            <LayeredValues
              className={cn(isPaused && 'text-grey')}
              topValue={formatTokensToReadableValue({
                value: asset.supplyBalanceTokens,
                token: asset.vToken.underlyingToken,
              })}
              bottomValue={formatCentsToReadableValue({
                value: asset.supplyBalanceCents,
              })}
            />
          );
        }

        if (column === 'borrowBalance') {
          return (
            <LayeredValues
              className={cn(isPaused && 'text-grey')}
              topValue={formatTokensToReadableValue({
                value: asset.borrowBalanceTokens,
                token: asset.vToken.underlyingToken,
              })}
              bottomValue={formatCentsToReadableValue({
                value: asset.borrowBalanceCents,
              })}
            />
          );
        }

        if (column === 'userBorrowLimitSharePercentage') {
          return (
            <div css={styles.userBorrowLimitSharePercentage}>
              <span className={cn(isPaused ? 'text-grey' : 'text-white')}>
                {formatPercentageToReadableValue(asset.userBorrowLimitSharePercentage)}
              </span>

              <ProgressBar
                min={0}
                max={100}
                value={asset.userBorrowLimitSharePercentage}
                step={1}
                ariaLabel={t('marketTable.columnKeys.userBorrowLimitSharePercentage')}
                css={styles.percentOfLimitProgressBar}
              />
            </div>
          );
        }
      },
      sortRows:
        column === 'asset' || column === 'assetAndChain'
          ? undefined
          : (rowA, rowB, direction) => {
              if (column === 'borrowApy' || column === 'labeledBorrowApy') {
                const roaABorrowApy = rowA.borrowApyPercentage.minus(
                  getCombinedDistributionApys({ asset: rowA }).totalBorrowApyBoostPercentage,
                );
                const roaBBorrowApy = rowB.borrowApyPercentage.minus(
                  getCombinedDistributionApys({ asset: rowB }).totalBorrowApyBoostPercentage,
                );

                return compareBigNumbers(roaABorrowApy, roaBBorrowApy, direction);
              }

              if (column === 'supplyApy' || column === 'labeledSupplyApy') {
                const roaASupplyApy = rowA.supplyApyPercentage.plus(
                  getCombinedDistributionApys({ asset: rowA }).totalSupplyApyBoostPercentage,
                );
                const roaBSupplyApy = rowB.supplyApyPercentage.plus(
                  getCombinedDistributionApys({ asset: rowB }).totalSupplyApyBoostPercentage,
                );

                return compareBigNumbers(roaASupplyApy, roaBSupplyApy, direction);
              }

              // Put rows of tokens that can't be enabled as collateral at the
              // bottom of the list
              if (column === 'collateral' && rowA.userCollateralFactor === 0) return 1;
              if (column === 'collateral' && rowB.userCollateralFactor === 0) return -1;
              // Sort other rows normally
              if (column === 'collateral') {
                return compareBooleans(rowA.isCollateralOfUser, rowB.isCollateralOfUser, direction);
              }

              if (column === 'liquidity') {
                return compareBigNumbers(rowA.liquidityCents, rowB.liquidityCents, direction);
              }

              if (column === 'userWalletBalance') {
                return compareBigNumbers(
                  rowA.userWalletBalanceCents,
                  rowB.userWalletBalanceCents,
                  direction,
                );
              }

              if (column === 'userSupplyBalance') {
                return compareBigNumbers(
                  rowA.userSupplyBalanceCents,
                  rowB.userSupplyBalanceCents,
                  direction,
                );
              }

              if (column === 'userBorrowBalance' || column === 'userBorrowLimitSharePercentage') {
                return compareBigNumbers(
                  rowA.userBorrowBalanceCents,
                  rowB.userBorrowBalanceCents,
                  direction,
                );
              }

              if (column === 'supplyBalance') {
                return compareBigNumbers(
                  rowA.supplyBalanceCents,
                  rowB.supplyBalanceCents,
                  direction,
                );
              }

              if (column === 'borrowBalance') {
                return compareBigNumbers(
                  rowA.borrowBalanceCents,
                  rowB.borrowBalanceCents,
                  direction,
                );
              }

              return 0;
            },
    };
  });

  return columns;
};
