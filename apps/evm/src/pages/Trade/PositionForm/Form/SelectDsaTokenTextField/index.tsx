import BigNumber from 'bignumber.js';

import {
  Button,
  type OptionalTokenBalance,
  SelectTokenTextField,
  type SelectTokenTextFieldProps,
} from 'components';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useGetTradeAssets } from 'pages/Trade/useGetTradeAssets';
import { useState } from 'react';
import { convertTokensToMantissa } from 'utilities';
import { LeverageFactorModal, type LeverageFactorModalProps } from './LeverageFactorModal';

export interface SelectDsaTokenTextFieldProps
  extends Omit<SelectTokenTextFieldProps, 'tokenBalances'>,
    Omit<LeverageFactorModalProps, 'onClose' | 'dsaAmountTokens' | 'dsaTokenPriceCents'> {}

export const SelectDsaTokenTextField: React.FC<SelectDsaTokenTextFieldProps> = ({
  selectedToken,
  onChange,
  hasError,
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

  const [isLeverageFactorModalOpen, setIsLeverageFactorModalOpen] = useState(false);

  const openLeverageFactorModal = () => setIsLeverageFactorModalOpen(true);

  const closeLeverageFactorModal = () => setIsLeverageFactorModalOpen(false);

  const {
    data: { dsaAssets },
  } = useGetTradeAssets({
    accountAddress,
  });

  const tokenBalances = dsaAssets.map<OptionalTokenBalance>(asset => ({
    token: asset.vToken.underlyingToken,
    balanceMantissa: convertTokensToMantissa({
      value: asset.userWalletBalanceTokens,
      token: asset.vToken.underlyingToken,
    }),
  }));

  return (
    <>
      <SelectTokenTextField
        tokenBalances={tokenBalances}
        selectedToken={selectedToken}
        onChange={onChange}
        value={value}
        tokenPriceCents={tokenPriceCents}
        hasError={hasError}
        topRightAdornment={
          <Button
            variant="senary"
            className="text-light-grey bg-transparent hover:text-white"
            onClick={openLeverageFactorModal}
            disabled={!accountAddress}
          >
            {t('operationForm.leverageFactor', {
              leverageFactor,
            })}
          </Button>
        }
        {...otherProps}
      />

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
