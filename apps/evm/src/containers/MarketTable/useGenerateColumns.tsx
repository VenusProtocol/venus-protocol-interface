import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import {
  InfoIcon,
  LayeredValues,
  ProgressBar,
  type TableColumn,
  Toggle,
  TokenIconWithSymbol,
} from 'components';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useTranslation } from 'libs/translations';
import {
  areAddressesEqual,
  cn,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
  getCombinedDistributionApys,
  isAssetPaused,
} from 'utilities';

import { Apy } from './Apy';
import type { ColumnKey, PoolAsset } from './types';

// Translation keys: do not remove this comment
// t('marketTable.columnKeys.asset')
// t('marketTable.columnKeys.supplyApyLtv')
// t('marketTable.columnKeys.labeledSupplyApyLtv')
// t('marketTable.columnKeys.borrowApy')
// t('marketTable.columnKeys.labeledBorrowApy')
// t('marketTable.columnKeys.pool')
// t('marketTable.columnKeys.collateral')
// t('marketTable.columnKeys.supplyBalance')
// t('marketTable.columnKeys.borrowBalance')
// t('marketTable.columnKeys.userBorrowBalance')
// t('marketTable.columnKeys.userSupplyBalance')
// t('marketTable.columnKeys.userWalletBalance')
// t('marketTable.columnKeys.userPercentOfLimit')
// t('marketTable.columnKeys.liquidity')
// t('marketTable.columnKeys.price')

const PRICE_THRESHOLD = new BigNumber(0.0000000000000001);

const useGenerateColumns = ({
  columnKeys,
  collateralOnChange,
}: {
  columnKeys: ColumnKey[];
  collateralOnChange: (poolAsset: PoolAsset) => void;
}) => {
  const { corePoolComptrollerContractAddress, stakedEthPoolComptrollerContractAddress } =
    useGetChainMetadata();
  const { t, Trans } = useTranslation();

  const columns: TableColumn<PoolAsset>[] = useMemo(
    () =>
      columnKeys.map(columnKey => ({
        id: columnKey,
        enableSorting: columnKey !== 'asset',
        accessorFn: row => {
          if (columnKey === 'borrowApy' || columnKey === 'labeledBorrowApy') {
            return row.borrowApyPercentage
              .minus(getCombinedDistributionApys({ asset: row }).totalBorrowApyPercentage)
              .toNumber();
          }

          if (columnKey === 'supplyApyLtv' || columnKey === 'labeledSupplyApyLtv') {
            return row.supplyApyPercentage
              .plus(getCombinedDistributionApys({ asset: row }).totalSupplyApyPercentage)
              .toNumber();
          }

          if (columnKey === 'collateral') {
            return row.collateralFactor === 0
              ? // Put rows of tokens that can't be enabled as collateral at the
                // bottom of the list
                -1
              : row.isCollateralOfUser;
          }

          if (columnKey === 'liquidity') {
            return row.liquidityCents.toNumber();
          }

          if (columnKey === 'price') {
            return row.tokenPriceCents.toNumber();
          }

          if (columnKey === 'pool') {
            return row.pool.name;
          }

          if (columnKey === 'userWalletBalance') {
            return row.userWalletBalanceCents.toNumber();
          }

          if (columnKey === 'userSupplyBalance') {
            return row.userSupplyBalanceCents.toNumber();
          }

          if (columnKey === 'userBorrowBalance' || columnKey === 'userPercentOfLimit') {
            return row.userBorrowBalanceCents.toNumber();
          }

          if (columnKey === 'supplyBalance') {
            return row.supplyBalanceCents.toNumber();
          }

          if (columnKey === 'borrowBalance') {
            return row.borrowBalanceCents.toNumber();
          }

          return 0;
        },
        meta: {
          className: columnKey === 'asset' ? 'min-w-43' : undefined,
        },
        header: () => {
          if (columnKey === 'borrowApy' || columnKey === 'labeledBorrowApy') {
            return (
              <Trans
                i18nKey={`marketTable.columnKeys.${columnKey}`}
                components={{
                  InfoIcon: (
                    <InfoIcon
                      tooltip={t('marketTable.columnTooltips.borrowApy')}
                      className="mr-1 align-sub"
                    />
                  ),
                }}
              />
            );
          }

          if (columnKey === 'supplyApyLtv' || columnKey === 'labeledSupplyApyLtv') {
            return (
              <Trans
                i18nKey={`marketTable.columnKeys.${columnKey}`}
                components={{
                  InfoIcon: (
                    <InfoIcon
                      tooltip={t('marketTable.columnTooltips.supplyApy')}
                      className="mr-1 align-sub"
                    />
                  ),
                }}
              />
            );
          }

          return t(`marketTable.columnKeys.${columnKey}`);
        },
        cell: ({ row }) => {
          const isPaused = isAssetPaused({
            disabledTokenActions: row.original.disabledTokenActions,
          });

          if (columnKey === 'asset') {
            return (
              <div className="flex items-center space-x-2">
                <TokenIconWithSymbol token={row.original.vToken.underlyingToken} />

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
            columnKey === 'supplyApyLtv' ||
            columnKey === 'borrowApy' ||
            columnKey === 'labeledSupplyApyLtv' ||
            columnKey === 'labeledBorrowApy'
          ) {
            return (
              <Apy
                className={cn(isPaused && 'text-grey')}
                asset={row.original}
                column={columnKey}
              />
            );
          }

          if (columnKey === 'collateral') {
            return row.original.collateralFactor || row.original.isCollateralOfUser ? (
              <Toggle
                onChange={() => collateralOnChange(row.original)}
                value={row.original.isCollateralOfUser}
              />
            ) : (
              PLACEHOLDER_KEY
            );
          }

          if (columnKey === 'liquidity') {
            return (
              <LayeredValues
                className={cn(isPaused && 'text-grey')}
                topValue={formatTokensToReadableValue({
                  value: row.original.cashTokens,
                  token: row.original.vToken.underlyingToken,
                })}
                bottomValue={formatCentsToReadableValue({
                  value: row.original.liquidityCents,
                })}
              />
            );
          }

          if (columnKey === 'price') {
            const { tokenPriceCents } = row.original;
            const price = tokenPriceCents.isGreaterThan(PRICE_THRESHOLD)
              ? tokenPriceCents
              : new BigNumber(0);

            return (
              <span className={cn(isPaused && 'text-grey')}>
                {formatCentsToReadableValue({
                  value: price,
                  isTokenPrice: true,
                })}
              </span>
            );
          }

          if (columnKey === 'pool') {
            const getTo = () => {
              if (
                areAddressesEqual(
                  corePoolComptrollerContractAddress,
                  row.original.pool.comptrollerAddress,
                )
              ) {
                return routes.corePool.path;
              }

              if (
                stakedEthPoolComptrollerContractAddress &&
                areAddressesEqual(
                  stakedEthPoolComptrollerContractAddress,
                  row.original.pool.comptrollerAddress,
                )
              ) {
                return routes.stakedEthPool.path;
              }

              return routes.isolatedPool.path.replace(
                ':poolComptrollerAddress',
                row.original.pool.comptrollerAddress,
              );
            };

            const to = getTo();

            return (
              <div>
                <Link
                  onClick={e => e.stopPropagation()}
                  to={to}
                  className={cn(
                    'hover:text-blue text-sm underline',
                    isPaused ? 'text-grey' : 'text-offWhite',
                  )}
                >
                  {row.original.pool.name}
                </Link>
              </div>
            );
          }

          if (columnKey === 'userWalletBalance') {
            return (
              <LayeredValues
                className={cn(isPaused && 'text-grey')}
                topValue={formatTokensToReadableValue({
                  value: row.original.userWalletBalanceTokens,
                  token: row.original.vToken.underlyingToken,
                })}
                bottomValue={formatCentsToReadableValue({
                  value: row.original.userWalletBalanceCents,
                })}
              />
            );
          }

          if (columnKey === 'userSupplyBalance') {
            return (
              <LayeredValues
                className={cn(isPaused && 'text-grey')}
                topValue={formatTokensToReadableValue({
                  value: row.original.userSupplyBalanceTokens,
                  token: row.original.vToken.underlyingToken,
                })}
                bottomValue={formatCentsToReadableValue({
                  value: row.original.userSupplyBalanceCents,
                })}
              />
            );
          }

          if (columnKey === 'userBorrowBalance') {
            return (
              <LayeredValues
                className={cn(isPaused && 'text-grey')}
                topValue={formatTokensToReadableValue({
                  value: row.original.userBorrowBalanceTokens,
                  token: row.original.vToken.underlyingToken,
                })}
                bottomValue={formatCentsToReadableValue({
                  value: row.original.userBorrowBalanceCents,
                })}
              />
            );
          }

          if (columnKey === 'supplyBalance') {
            return (
              <LayeredValues
                className={cn(isPaused && 'text-grey')}
                topValue={formatTokensToReadableValue({
                  value: row.original.supplyBalanceTokens,
                  token: row.original.vToken.underlyingToken,
                })}
                bottomValue={formatCentsToReadableValue({
                  value: row.original.supplyBalanceCents,
                })}
              />
            );
          }

          if (columnKey === 'borrowBalance') {
            return (
              <LayeredValues
                className={cn(isPaused && 'text-grey')}
                topValue={formatTokensToReadableValue({
                  value: row.original.borrowBalanceTokens,
                  token: row.original.vToken.underlyingToken,
                })}
                bottomValue={formatCentsToReadableValue({
                  value: row.original.borrowBalanceCents,
                })}
              />
            );
          }

          if (columnKey === 'userPercentOfLimit') {
            return (
              <div className="flex items-center justify-end gap-x-2">
                <span className={cn(isPaused ? 'text-grey' : 'text-offWhite')}>
                  {formatPercentageToReadableValue(row.original.userPercentOfLimit)}
                </span>

                <ProgressBar
                  min={0}
                  max={100}
                  value={row.original.userPercentOfLimit}
                  step={1}
                  ariaLabel={t('marketTable.columnKeys.userPercentOfLimit')}
                  className="w-13"
                />
              </div>
            );
          }
        },
      })),
    [
      corePoolComptrollerContractAddress,
      stakedEthPoolComptrollerContractAddress,
      columnKeys,
      Trans,
      t,
      collateralOnChange,
    ],
  );

  return columns;
};

export default useGenerateColumns;
