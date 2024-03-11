import type BigNumber from 'bignumber.js';

import { LabeledInlineContent } from 'components/LabeledInlineContent';
import { Spinner } from 'components/Spinner';
import { Tooltip } from 'components/Tooltip';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import { displayMutationError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';

import { TextButton } from '../Button';
import { Icon } from '../Icon';

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
      displayMutationError({ error });
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
            <Tooltip title={t('spendingLimit.revokeButtonTooltip')} className="inline-flex">
              <Icon
                name="bin"
                className="text-red h-5 w-5 transition-opacity hover:opacity-50 active:opacity-50"
              />
            </Tooltip>
          </TextButton>
        </>
      )}
    </LabeledInlineContent>
  );
};
