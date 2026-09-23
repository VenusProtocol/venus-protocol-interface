import {
  Apy,
  InfoIcon,
  LayeredValues,
  Pill,
  SpokeCollateralGroup,
  type TableColumn,
  TokenIconWithSymbol,
} from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { useTranslation } from 'libs/translations';
import type { SpokeAsset } from 'types';
import {
  compareBigNumbers,
  formatCentsToReadableValue,
  formatTokensToReadableValue,
  isAssetPaused,
} from 'utilities';

export interface UseColumnsInput {
  collaterals: SpokeAsset[];
}

export const useColumns = ({ collaterals }: UseColumnsInput) => {
  const { t, Trans } = useTranslation();

  const columns: TableColumn<SpokeAsset>[] = [
    {
      key: 'loanAsset',
      label: t('spokePools.table.columns.loanAsset'),
      selectOptionLabel: t('spokePools.table.columns.loanAsset'),
      renderCell: asset => (
        <div className="flex items-center gap-x-2">
          <TokenIconWithSymbol token={asset.vToken.underlyingToken} />

          {isAssetPaused({ disabledTokenActions: asset.disabledTokenActions }) && (
            <Pill>{t('spokePools.table.paused')}</Pill>
          )}
        </div>
      ),
    },
    {
      key: 'borrowed',
      label: t('spokePools.table.columns.borrowed'),
      selectOptionLabel: t('spokePools.table.columns.borrowed'),
      align: 'right',
      sortRows: (rowA, rowB, direction) =>
        compareBigNumbers(rowA.userBorrowBalanceCents, rowB.userBorrowBalanceCents, direction),
      renderCell: asset =>
        asset.userBorrowBalanceTokens.isGreaterThan(0) ? (
          <LayeredValues
            topValue={formatTokensToReadableValue({
              value: asset.userBorrowBalanceTokens,
              token: asset.vToken.underlyingToken,
              addSymbol: false,
            })}
            bottomValue={formatCentsToReadableValue({ value: asset.userBorrowBalanceCents })}
          />
        ) : (
          PLACEHOLDER_KEY
        ),
    },
    {
      key: 'borrowApy',
      label: (
        <Trans
          i18nKey="spokePools.table.columns.borrowApy.title"
          components={{
            InfoIcon: (
              <InfoIcon
                tooltip={t('spokePools.table.columns.borrowApy.tooltip')}
                className="align-sub ml-1"
              />
            ),
          }}
        />
      ),
      selectOptionLabel: t('spokePools.table.columns.borrowApy.selectOptionLabel'),
      align: 'right',
      sortRows: (rowA, rowB, direction) =>
        compareBigNumbers(rowA.borrowApyPercentage, rowB.borrowApyPercentage, direction),
      renderCell: asset => (
        <Apy
          type="borrow"
          token={asset.vToken.underlyingToken}
          baseApyPercentage={asset.borrowApyPercentage}
          tokenDistributions={asset.borrowTokenDistributions}
          userBalanceTokens={asset.userBorrowBalanceTokens}
        />
      ),
    },
    {
      key: 'liquidity',
      label: t('spokePools.table.columns.liquidity'),
      selectOptionLabel: t('spokePools.table.columns.liquidity'),
      align: 'right',
      sortRows: (rowA, rowB, direction) =>
        compareBigNumbers(rowA.liquidityCents, rowB.liquidityCents, direction),
      renderCell: asset => (
        <LayeredValues
          topValue={formatTokensToReadableValue({
            value: asset.cashTokens,
            token: asset.vToken.underlyingToken,
            addSymbol: false,
          })}
          bottomValue={formatCentsToReadableValue({ value: asset.liquidityCents })}
        />
      ),
    },
    {
      key: 'collateral',
      label: (
        <Trans
          i18nKey="spokePools.table.columns.collateral.title"
          components={{
            InfoIcon: (
              <InfoIcon
                tooltip={t('spokePools.table.columns.collateral.tooltip')}
                className="align-sub ml-1"
              />
            ),
          }}
        />
      ),
      selectOptionLabel: t('spokePools.table.columns.collateral.selectOptionLabel'),
      align: 'right',
      renderCell: () => <SpokeCollateralGroup collaterals={collaterals} />,
    },
    {
      key: 'totalBorrow',
      label: t('spokePools.table.columns.totalBorrow'),
      selectOptionLabel: t('spokePools.table.columns.totalBorrow'),
      align: 'right',
      sortRows: (rowA, rowB, direction) =>
        compareBigNumbers(rowA.borrowBalanceCents, rowB.borrowBalanceCents, direction),
      renderCell: asset => (
        <LayeredValues
          topValue={formatTokensToReadableValue({
            value: asset.borrowBalanceTokens,
            token: asset.vToken.underlyingToken,
            addSymbol: false,
          })}
          bottomValue={formatCentsToReadableValue({ value: asset.borrowBalanceCents })}
        />
      ),
    },
  ];

  return columns;
};
