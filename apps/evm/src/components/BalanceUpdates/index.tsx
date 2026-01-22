import type BigNumber from 'bignumber.js';
import { LabeledInlineContent, type LabeledInlineContentProps, ValueUpdate } from 'components';
import { useTranslation } from 'libs/translations';
import type { BalanceMutation, Pool } from 'types';
import {
  areAddressesEqual,
  formatCentsToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

interface Row {
  labeledInlineContentProps: LabeledInlineContentProps;
  readableAmountDollars?: string;
}

export interface BalanceUpdatesProps {
  pool: Pool;
  simulatedPool?: Pool;
  balanceMutations?: BalanceMutation[];
}

export const BalanceUpdates: React.FC<BalanceUpdatesProps> = ({
  pool,
  simulatedPool,
  balanceMutations = [],
}) => {
  const { t } = useTranslation();

  const balanceUpdateRows: Row[] = balanceMutations.reduce<Row[]>((acc, balanceMutation) => {
    // Skip VAI updates
    if (balanceMutation.type === 'vai') {
      return acc;
    }

    const asset = pool.assets.find(asset =>
      areAddressesEqual(asset.vToken.address, balanceMutation.vTokenAddress),
    );

    const simulatedAsset = simulatedPool?.assets.find(asset =>
      areAddressesEqual(asset.vToken.address, balanceMutation.vTokenAddress),
    );

    if (!asset) {
      // This case should never happen
      return acc;
    }

    let label: undefined | string;
    let balanceTokens: undefined | BigNumber;
    let simulatedBalanceTokens: undefined | BigNumber;

    if (balanceMutation.action === 'borrow' || balanceMutation.action === 'repay') {
      label = t('accountData.balanceUpdate.borrowBalance');

      balanceTokens = asset.userBorrowBalanceTokens;
      simulatedBalanceTokens = simulatedAsset?.userBorrowBalanceTokens;
    } else {
      label = t('accountData.balanceUpdate.supplyBalance');

      balanceTokens = asset.userSupplyBalanceTokens;
      simulatedBalanceTokens = simulatedAsset?.userSupplyBalanceTokens;
    }

    const original = formatTokensToReadableValue({
      token: asset.vToken.underlyingToken,
      value: balanceTokens,
      addSymbol: false,
    });

    const update =
      simulatedBalanceTokens &&
      formatTokensToReadableValue({
        token: asset.vToken.underlyingToken,
        value: simulatedBalanceTokens,
        addSymbol: false,
      });

    const updateAmountTokens = simulatedBalanceTokens
      ? simulatedBalanceTokens.minus(balanceTokens)
      : undefined;

    let readableAmountDollars = updateAmountTokens
      ? formatCentsToReadableValue({
          value: asset.tokenPriceCents.times(updateAmountTokens).absoluteValue(),
        })
      : undefined;

    if (readableAmountDollars && updateAmountTokens) {
      const sign = updateAmountTokens.isLessThan(0) ? '-' : '+';
      readableAmountDollars = `${sign} ${readableAmountDollars}`;
    }

    const row: Row = {
      readableAmountDollars,
      labeledInlineContentProps: {
        iconSrc: asset.vToken.underlyingToken,
        label,
        children: <ValueUpdate original={original} update={update} />,
      },
    };

    return [...acc, row];
  }, []);

  return (
    <div className="space-y-2">
      {balanceUpdateRows.map(({ labeledInlineContentProps, readableAmountDollars }, index) => (
        <div
          className="flex flex-col items-end"
          key={labeledInlineContentProps.label?.toString() ?? index}
        >
          <LabeledInlineContent {...labeledInlineContentProps} />

          {readableAmountDollars && <p className="text-grey text-sm">{readableAmountDollars}</p>}
        </div>
      ))}
    </div>
  );
};
