import BigNumber from 'bignumber.js';

import {
  AvailableBalance,
  Button,
  type OptionalTokenBalance,
  SelectTokenTextField,
  type SelectTokenTextFieldProps,
  SpendingLimit,
} from 'components';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import useTokenApproval from 'hooks/useTokenApproval';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useGetYieldPlusAssets } from 'pages/YieldPlus/useGetYieldPlusAssets';
import { useState } from 'react';
import { areTokensEqual, convertTokensToMantissa, formatTokensToReadableValue } from 'utilities';
import type { FormError } from '../types';
import { LeverageFactorModal, type LeverageFactorModalProps } from './LeverageFactorModal';

export interface SelectDsaTokenTextFieldProps
  extends Omit<SelectTokenTextFieldProps, 'tokenBalances'>,
    Omit<LeverageFactorModalProps, 'onClose' | 'dsaAmountTokens' | 'dsaTokenPriceCents'> {
  formError?: FormError;
}

export const SelectDsaTokenTextField: React.FC<SelectDsaTokenTextFieldProps> = ({
  selectedToken,
  onChange,
  hasError,
  formError,
  leverageFactor,
  maximumLeverageFactor,
  onChangeLeverageFactor,
  proportionalCloseTolerancePercentage,
  shortTokenPriceCents,
  shortTokenDecimals,
  longTokenPriceCents,
  longTokenCollateralFactor,
  dsaTokenCollateralFactor,
  value,
  tokenPriceCents,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();

  const { address: relativePositionManagerContractAddress } = useGetContractAddress({
    name: 'RelativePositionManager',
  });

  const [isLeverageFactorModalOpen, setIsLeverageFactorModalOpen] = useState(false);

  const openLeverageFactorModal = () => setIsLeverageFactorModalOpen(true);

  const closeLeverageFactorModal = () => setIsLeverageFactorModalOpen(false);

  const {
    data: { dsaAssets },
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

  const tokenBalances = dsaAssets.map<OptionalTokenBalance>(asset => {
    if (areTokensEqual(asset.vToken.underlyingToken, selectedToken)) {
      userDsaWalletBalanceTokens = asset.userWalletBalanceTokens;
    }

    return {
      token: asset.vToken.underlyingToken,
      balanceMantissa: convertTokensToMantissa({
        value: asset.userWalletBalanceTokens,
        token: asset.vToken.underlyingToken,
      }),
    };
  });

  const readableUserDsaWalletBalanceTokens = formatTokensToReadableValue({
    value: userDsaWalletBalanceTokens,
    token: selectedToken,
  });

  const handleWalletBalanceClick = () =>
    userDsaWalletBalanceTokens && onChange(userDsaWalletBalanceTokens.toFixed());

  return (
    <>
      <div className="flex flex-col gap-y-4">
        <SelectTokenTextField
          tokenBalances={tokenBalances}
          selectedToken={selectedToken}
          onChange={onChange}
          value={value}
          tokenPriceCents={tokenPriceCents}
          description={
            formError?.message ? <p className="text-red">{formError.message}</p> : undefined
          }
          hasError={hasError}
          topRightAdornment={
            <Button
              variant="senary"
              className="text-light-grey bg-transparent hover:text-white"
              onClick={openLeverageFactorModal}
            >
              {t('operationForm.leverageFactor', {
                leverageFactor,
              })}
            </Button>
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

      {isLeverageFactorModalOpen && (
        <LeverageFactorModal
          leverageFactor={leverageFactor}
          onChangeLeverageFactor={onChangeLeverageFactor}
          maximumLeverageFactor={maximumLeverageFactor}
          onClose={closeLeverageFactorModal}
          proportionalCloseTolerancePercentage={proportionalCloseTolerancePercentage}
          shortTokenPriceCents={shortTokenPriceCents}
          shortTokenDecimals={shortTokenDecimals}
          longTokenPriceCents={longTokenPriceCents}
          longTokenCollateralFactor={longTokenCollateralFactor}
          dsaTokenCollateralFactor={dsaTokenCollateralFactor}
          dsaAmountTokens={value ? new BigNumber(value) : undefined}
          dsaTokenPriceCents={tokenPriceCents}
        />
      )}
    </>
  );
};
