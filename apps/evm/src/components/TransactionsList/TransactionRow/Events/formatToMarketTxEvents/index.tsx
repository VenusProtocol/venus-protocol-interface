import type { useTranslation } from 'libs/translations';
import type { MarketTx } from 'types';
import { formatCentsToReadableValue, formatTokensToReadableValue } from 'utilities';
import type { EventProps } from '../Event';

type TransComponent = ReturnType<typeof useTranslation>['Trans'];

export const formatToMarketTxEvents = ({
  transaction,
  Trans,
}: { transaction: MarketTx; Trans: TransComponent }) => {
  const { amounts, txType, poolName, vToken } = transaction;
  const primaryAmount = amounts?.[0];
  const token = primaryAmount?.token || vToken.underlyingToken;

  const title = (() => {
    switch (txType) {
      case 'enterMarket':
        return (
          <Trans
            i18nKey="account.transactions.txText.enterMarket"
            components={{ Styled: <span className="text-green" /> }}
            values={{ vTokenSymbol: token.symbol }}
          />
        );
      case 'exitMarket':
        return (
          <Trans
            i18nKey="account.transactions.txText.exitMarket"
            components={{ Styled: <span className="text-red" /> }}
            values={{ vTokenSymbol: token.symbol }}
          />
        );
      default:
        return formatTokensToReadableValue({
          token,
          value: primaryAmount?.amountTokens,
        });
    }
  })();

  const description = primaryAmount
    ? `${formatCentsToReadableValue({ value: primaryAmount.amountCents })} • ${
        token.symbol
      } • ${poolName}`
    : poolName;

  const event: EventProps = {
    token,
    title,
    description,
  };

  return [event];
};
