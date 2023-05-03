/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  AccountData,
  Delimiter,
  IsolatedAssetWarning,
  SelectTokenTextField,
  SwapDetails,
  TokenTextField,
} from 'components';
import { VError } from 'errors';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'translation';
import { Asset, Pool, Swap, SwapError, TokenBalance } from 'types';
import {
  areTokensEqual,
  convertTokensToWei,
  convertWeiToTokens,
  isFeatureEnabled,
} from 'utilities';

import { useSupply, useSwapTokensAndSupply } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { useAuth } from 'context/AuthContext';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import useGetSwapInfo from 'hooks/useGetSwapInfo';
import useGetSwapTokenUserBalances from 'hooks/useGetSwapTokenUserBalances';

import { useStyles as useSharedStyles } from '../styles';
import Notice from './Notice';
import SubmitSection from './SubmitSection';
import TEST_IDS from './testIds';
import useForm, { FormValues, UseFormInput } from './useForm';

export const PRESET_PERCENTAGES = [25, 50, 75, 100];

export interface SupplyFormUiProps {
  asset: Asset;
  pool: Pool;
  onSubmit: UseFormInput['onSubmit'];
  isSubmitting: boolean;
  onCloseModal: () => void;
  tokenBalances?: TokenBalance[];
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues) => void;
  formValues: FormValues;
  isSwapLoading: boolean;
  swap?: Swap;
  swapError?: SwapError;
}

export const SupplyFormUi: React.FC<SupplyFormUiProps> = ({
  asset,
  pool,
  onCloseModal,
  onSubmit,
  isSubmitting,
  tokenBalances = [],
  setFormValues,
  formValues,
  isSwapLoading,
  swap,
  swapError,
}) => {
  const { t, Trans } = useTranslation();
  const sharedStyles = useSharedStyles();

  const isIntegratedSwapEnabled = useMemo(
    () =>
      isFeatureEnabled('integratedSwap') &&
      !areTokensEqual(asset.vToken.underlyingToken, TOKENS.bnb),
    [asset.vToken.underlyingToken],
  );

  const fromTokenUserWalletBalanceTokens = useMemo(() => {
    // Get wallet balance from the list of fetched token balances if integrated
    // swap feature is enabled and the selected token is different from the
    // asset object
    if (
      isIntegratedSwapEnabled &&
      formValues.fromToken &&
      !areTokensEqual(asset.vToken.underlyingToken, formValues.fromToken)
    ) {
      const tokenBalance = tokenBalances.find(item =>
        areTokensEqual(item.token, formValues.fromToken),
      );

      return (
        tokenBalance &&
        convertWeiToTokens({
          valueWei: tokenBalance.balanceWei,
          token: tokenBalance.token,
        })
      );
    }

    // Otherwise get the wallet balance from the asset object
    return asset.userWalletBalanceTokens;
  }, [
    isIntegratedSwapEnabled,
    asset.vToken.underlyingToken,
    asset.userWalletBalanceTokens,
    formValues.fromToken,
    tokenBalances,
  ]);

  const { handleSubmit, isFormValid, formError } = useForm({
    asset,
    fromTokenUserWalletBalanceTokens,
    swap,
    swapError,
    onCloseModal,
    onSubmit,
    formValues,
    setFormValues,
  });

  const readableFromTokenUserWalletBalanceTokens = useFormatTokensToReadableValue({
    value: fromTokenUserWalletBalanceTokens,
    token: formValues.fromToken,
  });

  const handleRightMaxButtonClick = useCallback(() => {
    // Update field value to correspond to user's wallet balance
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      amountTokens: new BigNumber(fromTokenUserWalletBalanceTokens || 0).toFixed(),
    }));
  }, [fromTokenUserWalletBalanceTokens]);

  return (
    <form onSubmit={handleSubmit}>
      {pool.isIsolated && (
        <IsolatedAssetWarning
          token={asset.vToken.underlyingToken}
          pool={pool}
          type="supply"
          css={sharedStyles.isolatedAssetWarning}
          data-testid={TEST_IDS.noticeIsolatedAsset}
        />
      )}

      <div css={sharedStyles.getRow({ isLast: true })}>
        {isIntegratedSwapEnabled ? (
          <SelectTokenTextField
            data-testid={TEST_IDS.selectTokenTextField}
            selectedToken={formValues.fromToken}
            value={formValues.amountTokens}
            hasError={!!formError && Number(formValues.amountTokens) > 0}
            disabled={isSubmitting || formError === 'SUPPLY_CAP_ALREADY_REACHED'}
            onChange={amountTokens =>
              setFormValues(currentFormValues => ({
                ...currentFormValues,
                amountTokens,
              }))
            }
            onChangeSelectedToken={fromToken =>
              setFormValues(currentFormValues => ({
                ...currentFormValues,
                fromToken,
              }))
            }
            rightMaxButton={{
              label: t('supplyWithdrawModal.supply.rightMaxButtonLabel'),
              onClick: handleRightMaxButtonClick,
            }}
            tokenBalances={tokenBalances}
            description={
              <Trans
                i18nKey="supplyWithdrawModal.supply.walletBalance"
                components={{
                  White: <span css={sharedStyles.whiteLabel} />,
                }}
                values={{ balance: readableFromTokenUserWalletBalanceTokens }}
              />
            }
          />
        ) : (
          <TokenTextField
            data-testid={TEST_IDS.tokenTextField}
            name="amountTokens"
            token={asset.vToken.underlyingToken}
            value={formValues.amountTokens}
            onChange={amountTokens =>
              setFormValues(currentFormValues => ({
                ...currentFormValues,
                amountTokens,
                // Reset selected fixed percentage
                fixedRepayPercentage: undefined,
              }))
            }
            disabled={isSubmitting || formError === 'SUPPLY_CAP_ALREADY_REACHED'}
            rightMaxButton={{
              label: t('supplyWithdrawModal.supply.rightMaxButtonLabel'),
              onClick: handleRightMaxButtonClick,
            }}
            hasError={!!formError && Number(formValues.amountTokens) > 0}
            description={
              <Trans
                i18nKey="supplyWithdrawModal.supply.walletBalance"
                components={{
                  White: <span css={sharedStyles.whiteLabel} />,
                }}
                values={{ balance: readableFromTokenUserWalletBalanceTokens }}
              />
            }
          />
        )}

        <Notice asset={asset} amount={formValues.amountTokens} />
      </div>

      {swap && (
        <>
          <SwapDetails
            action="supply"
            swap={swap}
            data-testid={TEST_IDS.swapDetails}
            css={sharedStyles.getRow({ isLast: true })}
          />

          <Delimiter css={sharedStyles.getRow({ isLast: true })} />
        </>
      )}

      <AccountData
        asset={asset}
        pool={pool}
        swap={swap}
        amountTokens={new BigNumber(formValues.amountTokens || 0)}
        action="supply"
      />

      <SubmitSection
        isFormSubmitting={isSubmitting}
        isFormValid={isFormValid}
        isSwapLoading={isSwapLoading}
        formError={formError}
        toToken={asset.vToken.underlyingToken}
        fromToken={formValues.fromToken}
        fromTokenAmountTokens={formValues.amountTokens}
      />
    </form>
  );
};

export interface SupplyFormProps {
  asset: Asset;
  pool: Pool;
  onCloseModal: () => void;
}

const SupplyForm: React.FC<SupplyFormProps> = ({ asset, pool, onCloseModal }) => {
  const { accountAddress } = useAuth();

  const [formValues, setFormValues] = useState<FormValues>({
    amountTokens: '',
    fromToken: asset.vToken.underlyingToken,
  });

  const { data: tokenBalances } = useGetSwapTokenUserBalances(
    {
      accountAddress,
    },
    {
      enabled: isFeatureEnabled('integratedSwap'),
    },
  );

  const { mutateAsync: supply, isLoading: isSupplyLoading } = useSupply({
    vToken: asset.vToken,
  });

  const { mutateAsync: swapExactTokensForTokensAndSupply, isLoading: isSwapAndSupplyLoading } =
    useSwapTokensAndSupply({
      vToken: asset.vToken,
    });

  const isSubmitting = isSupplyLoading || isSwapAndSupplyLoading;

  const onSubmit: SupplyFormUiProps['onSubmit'] = async ({
    toVToken,
    fromToken,
    fromTokenAmountTokens,
    swap,
  }) => {
    const isSwapping = !areTokensEqual(fromToken, toVToken.underlyingToken);

    // Handle supply flow
    if (!isSwapping) {
      const amountWei = convertTokensToWei({
        value: new BigNumber(fromTokenAmountTokens.trim()),
        token: fromToken,
      });

      return supply({ amountWei });
    }

    // Throw an error if we're meant to execute a swap but no swap was
    // passed through props. This should never happen since the form is
    // disabled while swap infos are being fetched, but we add this logic
    // as a safeguard
    if (!swap) {
      throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
    }

    return swapExactTokensForTokensAndSupply({
      swap,
    });
  };

  const swapInfo = useGetSwapInfo({
    fromToken: formValues.fromToken,
    fromTokenAmountTokens: formValues.amountTokens,
    toToken: asset.vToken.underlyingToken,
    direction: 'exactAmountIn',
  });

  return (
    <SupplyFormUi
      asset={asset}
      pool={pool}
      formValues={formValues}
      setFormValues={setFormValues}
      onCloseModal={onCloseModal}
      tokenBalances={tokenBalances}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      swap={swapInfo.swap}
      swapError={swapInfo.error}
      isSwapLoading={swapInfo.isLoading}
    />
  );
};

export default SupplyForm;
