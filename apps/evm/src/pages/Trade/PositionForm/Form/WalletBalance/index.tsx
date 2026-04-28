import { AvailableBalance, SpendingLimit } from 'components';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import useTokenApproval from 'hooks/useTokenApproval';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useGetTradeAssets } from 'pages/Trade/useGetTradeAssets';
import type { Token } from 'types';
import { areTokensEqual, formatTokensToReadableValue } from 'utilities';

interface WalletBalanceProps {
  token: Token;
  onBalanceClick: (walletBalanceTokens: BigNumber) => unknown;
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({ onBalanceClick, token }) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();

  const { address: relativePositionManagerContractAddress } = useGetContractAddress({
    name: 'RelativePositionManager',
  });

  const {
    data: { dsaAssets },
  } = useGetTradeAssets({
    accountAddress,
  });

  const userWalletBalanceTokens = dsaAssets.find(asset =>
    areTokensEqual(asset.vToken.underlyingToken, token),
  )?.userWalletBalanceTokens;

  const readableBalance = formatTokensToReadableValue({
    value: userWalletBalanceTokens,
    token,
  });

  const {
    walletSpendingLimitTokens: fromTokenWalletSpendingLimitTokens,
    revokeWalletSpendingLimit: revokeFromTokenWalletSpendingLimit,
    isRevokeWalletSpendingLimitLoading: isRevokeFromTokenWalletSpendingLimitLoading,
  } = useTokenApproval({
    token,
    spenderAddress: relativePositionManagerContractAddress,
    accountAddress,
  });

  return (
    <div className="space-y-2">
      <AvailableBalance
        label={t('trade.operationForm.walletBalance')}
        readableBalance={readableBalance}
        onClick={
          !!accountAddress && userWalletBalanceTokens
            ? () => onBalanceClick(userWalletBalanceTokens)
            : undefined
        }
      />

      <SpendingLimit
        token={token}
        walletBalanceTokens={userWalletBalanceTokens}
        walletSpendingLimitTokens={fromTokenWalletSpendingLimitTokens}
        onRevoke={revokeFromTokenWalletSpendingLimit}
        isRevokeLoading={isRevokeFromTokenWalletSpendingLimitLoading}
      />
    </div>
  );
};
