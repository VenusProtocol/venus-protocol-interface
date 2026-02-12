import type { AmountTransaction } from 'clients/api';
import { useTranslation } from 'libs/translations';
import { TxType } from 'types';
import { formatTokensToReadableValue } from 'utilities';

export interface TransactionTextProps {
  amountTokens: AmountTransaction['amountTokens'];
  token: AmountTransaction['token'];
  txType: AmountTransaction['txType'];
  vTokenSymbol: AmountTransaction['vTokenSymbol'];
}

export const TransactionText: React.FC<TransactionTextProps> = ({
  amountTokens,
  token,
  txType,
  vTokenSymbol,
}) => {
  const { Trans } = useTranslation();

  switch (txType) {
    case TxType.Approve:
      return (
        <Trans
          i18nKey="dashboard.transactions.txText.approve"
          values={{
            tokenAmount: formatTokensToReadableValue({
              token,
              value: amountTokens,
            }),
          }}
        />
      );
    case TxType.EnterMarket:
      return (
        <Trans
          i18nKey="dashboard.transactions.txText.enterMarket"
          components={{ Styled: <span className="text-green" /> }}
          values={{ vTokenSymbol }}
        />
      );
    case TxType.ExitMarket:
      return (
        <Trans
          i18nKey="dashboard.transactions.txText.exitMarket"
          components={{ Styled: <span className="text-red" /> }}
          values={{ vTokenSymbol }}
        />
      );
    default:
      return formatTokensToReadableValue({
        token,
        value: amountTokens,
      });
  }
};
