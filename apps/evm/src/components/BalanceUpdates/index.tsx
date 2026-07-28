import BigNumber from 'bignumber.js';

import { LabeledValueUpdate, type LabeledValueUpdateProps } from 'components';
import { useTranslation } from 'libs/translations';
import type { BalanceMutation, LiquidityHub, Pool, Token } from 'types';
import { formatTokensToReadableValue } from 'utilities';

import { getAssetBalanceUpdate } from './getAssetBalanceUpdate';
import { getLiquidityHubBalanceUpdate } from './getLiquidityHubBalanceUpdate';

export interface BalanceUpdate {
  action: 'borrow' | 'repay' | 'withdraw' | 'supply';
  amountTokens: BigNumber;
  balanceTokens: BigNumber;
  description?: string;
  label: string;
  token: Token;
  tokenPriceCents: BigNumber;
}

export interface BalanceUpdatesProps {
  pool?: Pool;
  liquidityHubs?: LiquidityHub[];
  balanceMutations?: BalanceMutation[];
}

export const BalanceUpdates: React.FC<BalanceUpdatesProps> = ({
  pool,
  liquidityHubs,
  balanceMutations = [],
}) => {
  const { t } = useTranslation();

  const balanceUpdateRows: LabeledValueUpdateProps[] = balanceMutations.reduce<
    LabeledValueUpdateProps[]
  >((acc, balanceMutation) => {
    let balanceUpdate: BalanceUpdate | undefined;

    if (balanceMutation.type === 'asset') {
      balanceUpdate = getAssetBalanceUpdate({ balanceMutation, pool, t });
    } else if (balanceMutation.type === 'liquidityHub') {
      balanceUpdate = getLiquidityHubBalanceUpdate({ balanceMutation, liquidityHubs, t });
    }

    if (!balanceUpdate) {
      return acc;
    }

    const { action, amountTokens, balanceTokens, token, tokenPriceCents } = balanceUpdate;

    let simulatedBalanceTokens: BigNumber | undefined;

    if (amountTokens.isGreaterThan(0)) {
      simulatedBalanceTokens =
        action === 'supply' || action === 'borrow'
          ? balanceTokens.plus(amountTokens)
          : balanceTokens.minus(amountTokens);

      // Clamp balance to 0
      simulatedBalanceTokens = BigNumber.max(simulatedBalanceTokens, 0);
    }

    const original = formatTokensToReadableValue({
      token,
      value: balanceTokens,
      addSymbol: false,
    });

    const update =
      simulatedBalanceTokens &&
      formatTokensToReadableValue({
        token,
        value: simulatedBalanceTokens,
        addSymbol: false,
      });

    const updateAmountTokens = simulatedBalanceTokens
      ? simulatedBalanceTokens.minus(balanceTokens)
      : undefined;

    const deltaAmountCents = updateAmountTokens
      ? tokenPriceCents.times(updateAmountTokens)
      : undefined;

    const row: LabeledValueUpdateProps = {
      deltaAmountCents,
      iconSrc: token,
      label: balanceUpdate.label,
      description: balanceUpdate.description,
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
