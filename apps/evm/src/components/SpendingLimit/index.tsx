import { TextButton } from '@venusprotocol/ui';
import type BigNumber from 'bignumber.js';

import { Spinner } from '@venusprotocol/ui';
import { InfoIcon } from 'components/InfoIcon';
import { LabeledInlineContent } from 'components/LabeledInlineContent';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import { handleError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';

export interface SpendingLimitProps {
  token: Token;
  onRevoke: () => Promise<unknown>;
  isRevokeLoading: boolean;
  walletBalanceTokens?: BigNumber;
  walletSpendingLimitTokens?: BigNumber;
  className?: string;
}

export const SpendingLimit: React.FC<SpendingLimitProps> = ({
  walletSpendingLimitTokens,
  walletBalanceTokens,
  isRevokeLoading,
  token,
  onRevoke,
  ...otherContainerProps
}) => {
  const { t } = useTranslation();

  const handleRevoke = async () => {
    try {
      await onRevoke();
    } catch (error) {
      handleError({ error });
    }
  };

  const readableWalletSpendingLimit = useFormatTokensToReadableValue({
    value: walletSpendingLimitTokens,
    token,
  });

  // Only display component if spending limit is smaller than user balance
  const shouldDisplayWalletSpendingLimit =
    !token.isNative &&
    walletSpendingLimitTokens &&
    walletSpendingLimitTokens.isGreaterThan(0) &&
    walletBalanceTokens &&
    walletSpendingLimitTokens.isLessThan(walletBalanceTokens);

  if (!shouldDisplayWalletSpendingLimit) {
    return null;
  }

  return (
    <LabeledInlineContent
      label={t('spendingLimit.label')}
      tooltip={t('spendingLimit.labelTooltip')}
      {...otherContainerProps}
    >
      {isRevokeLoading ? (
        <Spinner className="ml-2" variant="small" />
      ) : (
        <>
          <div>{readableWalletSpendingLimit}</div>

          <TextButton onClick={handleRevoke} className="text-red ml-2 h-auto p-0">
            <InfoIcon
              iconName="bin"
              iconClassName="text-red h-5 w-5 transition-opacity hover:opacity-50 active:opacity-50"
              tooltip={t('spendingLimit.revokeButtonTooltip')}
              className="inline-flex"
            />
          </TextButton>
        </>
      )}
    </LabeledInlineContent>
  );
};
