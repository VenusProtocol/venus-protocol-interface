import type BigNumber from 'bignumber.js';
import type { Address } from 'viem';

import { useGetBalanceOf } from 'clients/api';
import { AvailableBalance, SpendingLimit } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import useTokenApproval from 'hooks/useTokenApproval';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Token } from 'types';
import { convertMantissaToTokens, formatTokensToReadableValue } from 'utilities';

export interface WalletBalanceProps {
  token: Token;
  onBalanceClick: (walletBalanceTokens: BigNumber) => unknown;
  spenderAddress?: Address;
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({
  onBalanceClick,
  spenderAddress,
  token,
}) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();

  const { data: getBalanceOfData } = useGetBalanceOf(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      token,
    },
    {
      enabled: !!accountAddress,
    },
  );

  const userWalletBalanceTokens = getBalanceOfData?.balanceMantissa
    ? convertMantissaToTokens({
        value: getBalanceOfData.balanceMantissa,
        token,
      })
    : undefined;

  const readableBalance = formatTokensToReadableValue({
    value: userWalletBalanceTokens,
    token,
  });

  const {
    walletSpendingLimitTokens,
    revokeWalletSpendingLimit,
    isRevokeWalletSpendingLimitLoading,
  } = useTokenApproval({
    token,
    spenderAddress,
    accountAddress,
  });

  const handleBalanceClick = userWalletBalanceTokens?.isGreaterThan(0)
    ? () => onBalanceClick(userWalletBalanceTokens)
    : undefined;

  return (
    <div className="space-y-2">
      <AvailableBalance
        label={t('trade.operationForm.walletBalance')}
        readableBalance={readableBalance}
        onClick={handleBalanceClick}
      />

      <SpendingLimit
        token={token}
        walletBalanceTokens={userWalletBalanceTokens}
        walletSpendingLimitTokens={walletSpendingLimitTokens}
        onRevoke={revokeWalletSpendingLimit}
        isRevokeLoading={isRevokeWalletSpendingLimitLoading}
      />
    </div>
  );
};
