import type { Address } from 'viem';

import { SpendingLimit } from 'components';
import useTokenApproval from 'hooks/useTokenApproval';
import { useAccountAddress } from 'libs/wallet';
import type { Asset } from 'types';

export interface ConvertedSpendingLimitProps {
  asset: Asset;
  spenderAddress?: Address;
}

export const ConvertedSpendingLimit: React.FC<ConvertedSpendingLimitProps> = ({
  asset,
  spenderAddress,
}) => {
  const { accountAddress } = useAccountAddress();

  const {
    walletSpendingLimitTokens: walletSpendingLimitVTokens,
    revokeWalletSpendingLimit,
    isRevokeWalletSpendingLimitLoading,
  } = useTokenApproval({
    token: asset.vToken,
    spenderAddress,
    accountAddress,
  });

  // Convert vToken spending limit to underlying tokens
  const walletSpendingLimitTokens = walletSpendingLimitVTokens?.div(asset.exchangeRateVTokens);

  return (
    <SpendingLimit
      token={asset.vToken.underlyingToken}
      walletBalanceTokens={asset.userWalletBalanceTokens}
      walletSpendingLimitTokens={walletSpendingLimitTokens}
      onRevoke={revokeWalletSpendingLimit}
      isRevokeLoading={isRevokeWalletSpendingLimitLoading}
    />
  );
};
