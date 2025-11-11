import { LabeledInlineContent, type LabeledInlineContentProps, ValueUpdate } from 'components';
import { useTranslation } from 'libs/translations';
import type { BalanceMutation, Pool } from 'types';
import { areAddressesEqual, formatTokensToReadableValue } from 'utilities';

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

  const balanceUpdateRows: LabeledInlineContentProps[] = balanceMutations.reduce<
    LabeledInlineContentProps[]
  >((acc, balanceMutation) => {
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
      simulatedBalanceTokens = simulatedAsset?.userBorrowBalanceCents;
    } else {
      label = t('accountData.balanceUpdate.supplyBalance');

      balanceTokens = asset.userSupplyBalanceTokens;
      simulatedBalanceTokens = simulatedAsset?.userSupplyBalanceTokens;
    }

    const row: LabeledInlineContentProps = {
      iconSrc: asset.vToken.underlyingToken,
      label,
      children: (
        <ValueUpdate
          original={formatTokensToReadableValue({
            token: asset.vToken.underlyingToken,
            value: balanceTokens,
            addSymbol: false,
          })}
          update={
            simulatedBalanceTokens &&
            formatTokensToReadableValue({
              token: asset.vToken.underlyingToken,
              value: simulatedBalanceTokens,
              addSymbol: false,
            })
          }
        />
      ),
    };

    return [...acc, row];
  }, []);

  return balanceUpdateRows.map(row => <LabeledInlineContent {...row} key={row.label} />);
};
