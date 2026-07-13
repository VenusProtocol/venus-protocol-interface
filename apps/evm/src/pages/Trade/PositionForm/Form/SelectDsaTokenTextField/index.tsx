import BigNumber from 'bignumber.js';

import { Button, SelectTokenTextField, type SelectTokenTextFieldProps } from 'components';
import type { OptionalTokenBalance } from 'containers/TokenListWrapper';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useGetTradeAssets } from 'pages/Trade/useGetTradeAssets';
import { useState } from 'react';
import { convertTokensToMantissa } from 'utilities';
import { LeverageFactorModal, type LeverageFactorModalProps } from './LeverageFactorModal';

export interface SelectDsaTokenTextFieldProps
  extends Omit<SelectTokenTextFieldProps, 'tokenBalances'>,
    Omit<LeverageFactorModalProps, 'onClose' | 'dsaAmountTokens' | 'dsaTokenLimitPriceCents'> {
  dsaTokenLimitPriceCents: number;
}

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
  dsaTokenLimitPriceCents,
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

  const tokenBalances = dsaAssets.reduce<OptionalTokenBalance[]>((acc, asset) => {
    // Filter out restricted assets
    if (asset.isRestricted) {
      return acc;
    }

    const tokenBalance: OptionalTokenBalance = {
      token: asset.vToken.underlyingToken,
      balanceMantissa: convertTokensToMantissa({
        value: asset.userWalletBalanceTokens,
        token: asset.vToken.underlyingToken,
      }),
      isGated: asset.isGated,
    };

    return [...acc, tokenBalance];
  }, []);

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
            {t('marketForm.leverageFactor', {
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
          dsaTokenLimitPriceCents={dsaTokenLimitPriceCents}
        />
      )}
    </>
  );
};
