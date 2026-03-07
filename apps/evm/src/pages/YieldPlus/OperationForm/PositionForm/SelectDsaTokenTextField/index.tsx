import type BigNumber from 'bignumber.js';

import {
  AvailableBalance,
  SelectTokenTextField,
  type SelectTokenTextFieldProps,
  SpendingLimit,
} from 'components';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import useTokenApproval from 'hooks/useTokenApproval';
import { useAccountAddress } from 'libs/wallet';
import { useGetYieldPlusAssets } from 'pages/YieldPlus/useGetYieldPlusAssets';
import { areTokensEqual, formatTokensToReadableValue } from 'utilities';
import type { FormError } from '../types';

export interface SelectDsaTokenTextFieldProps
  extends Omit<SelectTokenTextFieldProps, 'tokenBalances'> {
  formError?: FormError;
}

export const SelectDsaTokenTextField: React.FC<SelectDsaTokenTextFieldProps> = ({
  selectedToken,
  onChange,
  hasError,
  formError,
  ...otherProps
}) => {
  const { accountAddress } = useAccountAddress();
  const { address: relativePositionManagerContractAddress } = useGetContractAddress({
    name: 'RelativePositionManager',
  });

  const {
    data: { supplyAssets },
  } = useGetYieldPlusAssets({
    accountAddress,
  });

  const {
    walletSpendingLimitTokens: fromTokenWalletSpendingLimitTokens,
    revokeWalletSpendingLimit: revokeFromTokenWalletSpendingLimit,
    isRevokeWalletSpendingLimitLoading: isRevokeFromTokenWalletSpendingLimitLoading,
  } = useTokenApproval({
    token: selectedToken,
    spenderAddress: relativePositionManagerContractAddress,
    accountAddress,
  });

  let userDsaWalletBalanceTokens: BigNumber | undefined;

  const tokenBalances = supplyAssets.map(asset => {
    if (areTokensEqual(asset.vToken.underlyingToken, selectedToken)) {
      userDsaWalletBalanceTokens = asset.userWalletBalanceTokens;
    }

    return {
      token: asset.vToken.underlyingToken,
    };
  });

  const readableUserDsaWalletBalanceTokens = formatTokensToReadableValue({
    value: userDsaWalletBalanceTokens,
    token: selectedToken,
  });

  const handleWalletBalanceClick = () =>
    userDsaWalletBalanceTokens && onChange(userDsaWalletBalanceTokens.toFixed());

  return (
    <div className="flex flex-col gap-y-4">
      <SelectTokenTextField
        tokenBalances={tokenBalances}
        selectedToken={selectedToken}
        onChange={onChange}
        hasError={hasError || !!formError}
        description={
          formError?.message ? <p className="text-red">{formError.message}</p> : undefined
        }
        {...otherProps}
      />

      {!!accountAddress && (
        <div className="space-y-2">
          <AvailableBalance
            readableBalance={readableUserDsaWalletBalanceTokens}
            onClick={handleWalletBalanceClick}
          />

          <SpendingLimit
            token={selectedToken}
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
