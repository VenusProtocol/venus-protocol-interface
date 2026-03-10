import { LabeledValueUpdate, type LabeledValueUpdateProps } from 'components';
import { useTranslation } from 'libs/translations';
import type { BalanceMutation, Pool } from 'types';
import { areAddressesEqual, formatTokensToReadableValue } from 'utilities';

export interface BalanceUpdatesProps {
  pool: Pool;
  balanceMutations?: BalanceMutation[];
}

export const BalanceUpdates: React.FC<BalanceUpdatesProps> = ({ pool, balanceMutations = [] }) => {
  const { t } = useTranslation();

  const balanceUpdateRows: LabeledValueUpdateProps[] = balanceMutations.reduce<
    LabeledValueUpdateProps[]
  >((acc, balanceMutation) => {
    // Skip VAI updates
    if (balanceMutation.type === 'vai') {
      return acc;
    }

    const asset = pool.assets.find(asset =>
      areAddressesEqual(asset.vToken.address, balanceMutation.vTokenAddress),
    );

    if (!asset) {
      // This case should never happen
      return acc;
    }

    const balanceTokens =
      balanceMutation.action === 'borrow' || balanceMutation.action === 'repay'
        ? asset.userBorrowBalanceTokens
        : asset.userSupplyBalanceTokens;

    let simulatedBalanceTokens: BigNumber | undefined;

    if (balanceMutation.amountTokens.isGreaterThan(0)) {
      simulatedBalanceTokens =
        balanceMutation.action === 'supply' || balanceMutation.action === 'borrow'
          ? balanceTokens.plus(balanceMutation.amountTokens)
          : balanceTokens.minus(balanceMutation.amountTokens);
    }

    let label = balanceMutation.label;

    if (!label) {
      label =
        balanceMutation.action === 'borrow' || balanceMutation.action === 'repay'
          ? t('accountData.balanceUpdate.borrowBalance')
          : t('accountData.balanceUpdate.supplyBalance');
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

    const deltaAmountCents = updateAmountTokens
      ? asset.tokenPriceCents.times(updateAmountTokens)
      : undefined;

    const row: LabeledValueUpdateProps = {
      deltaAmountCents,
      iconSrc: asset.vToken.underlyingToken,
      label,
      original,
      update,
    };

    return [...acc, row];
  }, []);

  return (
    <div className="space-y-2">
      {balanceUpdateRows.map((row, index) => (
        <LabeledValueUpdate key={row.label?.toString() ?? index} {...row} />
      ))}
    </div>
  );
};
