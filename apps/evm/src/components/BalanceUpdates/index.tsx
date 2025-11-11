import { LabeledInlineContent, type LabeledInlineContentProps, ValueUpdate } from 'components';
import { useTranslation } from 'libs/translations';
import type { BalanceMutation, Pool } from 'types';
import { areAddressesEqual, convertMantissaToTokens } from 'utilities';

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

  const balanceUpdateRows: LabeledInlineContentProps[] = [];

  if (balanceMutations.length > 0) {
    balanceUpdateRows.push(
      ...balanceMutations.reduce<LabeledInlineContentProps[]>((acc, balanceMutation) => {
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

        if (!asset || !simulatedAsset) {
          // This case should never happen
          return acc;
        }

        let label: undefined | string;
        let balanceTokens: undefined | BigNumber;
        let simulatedBalanceTokens: undefined | BigNumber;

        switch (balanceMutation.action) {
          case 'supply':
          case 'withdraw':
            label = t('accountData.balanceUpdate.supplyBalance', {
              tokenSymbol: asset.vToken.underlyingToken.symbol,
            });

            balanceTokens = asset.userSupplyBalanceTokens;
            simulatedBalanceTokens = simulatedAsset.userSupplyBalanceTokens;
            break;
          case 'borrow':
          case 'repay':
            label = t('accountData.balanceUpdate.borrowBalance', {
              tokenSymbol: asset.vToken.underlyingToken.symbol,
            });

            balanceTokens = asset.userBorrowBalanceTokens;
            simulatedBalanceTokens = simulatedAsset.userBorrowBalanceCents;
            break;
        }

        const row: LabeledInlineContentProps = {
          iconSrc: asset.vToken.underlyingToken,
          label,
          children: (
            <ValueUpdate
              original={convertMantissaToTokens({
                token: asset.vToken.underlyingToken,
                value: balanceTokens,
                returnInReadableFormat: true,
              })}
              update={
                simulatedBalanceTokens &&
                convertMantissaToTokens({
                  token: asset.vToken.underlyingToken,
                  value: simulatedBalanceTokens,
                  returnInReadableFormat: true,
                })
              }
            />
          ),
        };

        return [...acc, row];
      }, []),
    );
  }

  return balanceUpdateRows.map(row => <LabeledInlineContent {...row} key={row.label} />);
};
