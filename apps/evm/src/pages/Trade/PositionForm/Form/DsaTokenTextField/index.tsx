import {
  AvailableBalance,
  SpendingLimit,
  TokenTextField,
  type TokenTextFieldProps,
} from 'components';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import useTokenApproval from 'hooks/useTokenApproval';
import { useAccountAddress } from 'libs/wallet';
import { useGetTradeAssets } from 'pages/Trade/useGetTradeAssets';
import { areTokensEqual, formatTokensToReadableValue } from 'utilities';

export interface DsaTokenTextFieldProps extends TokenTextFieldProps {}

export const DsaTokenTextField: React.FC<DsaTokenTextFieldProps> = ({
  token,
  onChange,
  value,
  tokenPriceCents,
  ...otherProps
}) => {
  const { accountAddress } = useAccountAddress();

  const { address: relativePositionManagerContractAddress } = useGetContractAddress({
    name: 'RelativePositionManager',
  });

  const {
    data: { dsaAssets },
  } = useGetTradeAssets({
    accountAddress,
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

  const userDsaWalletBalanceTokens = dsaAssets.find(asset =>
    areTokensEqual(asset.vToken.underlyingToken, token),
  )?.userWalletBalanceTokens;

  const readableLimit = formatTokensToReadableValue({
    value: userDsaWalletBalanceTokens,
    token,
  });

  const handleWalletBalanceClick = () =>
    userDsaWalletBalanceTokens && onChange(userDsaWalletBalanceTokens.toFixed());

  return (
    <div className="flex flex-col gap-y-4">
      <TokenTextField
        token={token}
        onChange={onChange}
        value={value}
        tokenPriceCents={tokenPriceCents}
        {...otherProps}
      />

      {!!accountAddress && (
        <div className="space-y-2">
          <AvailableBalance readableBalance={readableLimit} onClick={handleWalletBalanceClick} />

          <SpendingLimit
            token={token}
            walletBalanceTokens={userDsaWalletBalanceTokens}
            walletSpendingLimitTokens={fromTokenWalletSpendingLimitTokens}
            onRevoke={revokeFromTokenWalletSpendingLimit}
            isRevokeLoading={isRevokeFromTokenWalletSpendingLimitLoading}
          />
        </div>
      )}
    </div>
  );
};
