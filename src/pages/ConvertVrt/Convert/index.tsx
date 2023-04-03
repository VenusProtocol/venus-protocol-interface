/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import {
  ConnectWallet,
  EnableToken,
  FormikSubmitButton,
  FormikTokenTextField,
  Icon,
  TokenIcon,
  TokenTextField,
  toast,
} from 'components';
import { ContractReceipt } from 'ethers';
import noop from 'noop-ts';
import React, { useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'translation';
import {
  convertTokensToWei,
  convertWeiToTokens,
  formatTokensToReadableValue,
  getContractAddress,
} from 'utilities';

import { TOKENS } from 'constants/tokens';
import { AmountForm, ErrorCode } from 'containers/AmountForm';
import { DisableLunaUstWarningContext } from 'context/DisableLunaUstWarning';
import { VError } from 'errors/VError';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';

import { useStyles } from '../styles';
import TEST_IDS from './testIds';

export interface ConvertProps {
  xvsToVrtConversionRatio: BigNumber | undefined;
  vrtConversionEndTime: Date | undefined;
  userVrtBalanceWei: BigNumber | undefined;
  convertVrtLoading: boolean;
  convertVrt: (amount: string) => Promise<ContractReceipt>;
}

const vrtConverterProxyContractAddress = getContractAddress('vrtConverterProxy');

const Convert: React.FC<ConvertProps> = ({
  xvsToVrtConversionRatio,
  vrtConversionEndTime,
  userVrtBalanceWei,
  convertVrtLoading,
  convertVrt,
}) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();
  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

  const { hasLunaOrUstCollateralEnabled, openLunaUstWarningModal } = useContext(
    DisableLunaUstWarningContext,
  );

  const readableXvsAvailable = useConvertWeiToReadableTokenString({
    valueWei: xvsToVrtConversionRatio && userVrtBalanceWei?.times(xvsToVrtConversionRatio),
    token: TOKENS.xvs,
  });

  const readableUserVrtBalance = useMemo(() => {
    const userVrtBalanceTokens =
      userVrtBalanceWei &&
      convertWeiToTokens({
        valueWei: userVrtBalanceWei,
        token: TOKENS.vrt,
      });

    return formatTokensToReadableValue({
      value: userVrtBalanceTokens,
      token: TOKENS.vrt,
    });
  }, [userVrtBalanceWei?.toFixed()]);

  useConvertWeiToReadableTokenString({
    valueWei: userVrtBalanceWei,
    token: TOKENS.vrt,
  });

  const calculateXvsFromVrt = useCallback(
    (value: BigNumber) =>
      !value.isNaN() && !value.isZero() && xvsToVrtConversionRatio
        ? new BigNumber(value).times(xvsToVrtConversionRatio)
        : undefined,
    [xvsToVrtConversionRatio],
  );

  const onSubmit = async (vrtAmount: string) => {
    // Block action is user has LUNA or UST enabled as collateral
    if (hasLunaOrUstCollateralEnabled) {
      openLunaUstWarningModal();
      return;
    }

    try {
      const vrtAmountWei = convertTokensToWei({
        value: new BigNumber(vrtAmount),
        token: TOKENS.vrt,
      });
      const contractReceipt = await convertVrt(vrtAmountWei.toFixed());
      // Display successful transaction modal
      if (!xvsToVrtConversionRatio) {
        // This should never happen because the form is not rendered without successfully fetching this
        throw new VError({
          type: 'unexpected',
          code: 'internalErrorXvsToVrtConversionRatioUndefined',
        });
      }

      const xvsAmountWei = calculateXvsFromVrt(vrtAmountWei);

      openSuccessfulTransactionModal({
        title: t('convertVrt.successfulConvertTransactionModal.title'),
        transactionHash: contractReceipt.transactionHash,
        content: (
          <div css={styles.successModalConversionAmounts}>
            <TokenIcon token={TOKENS.vrt} css={styles.successModalToken} />

            <Typography variant="small2" css={[styles.fontWeight600, styles.successMessage]}>
              {convertWeiToTokens({
                valueWei: vrtAmountWei,
                token: TOKENS.vrt,
                returnInReadableFormat: true,
              })}
            </Typography>
            <Icon name="arrowShaft" css={styles.successModalArrow} />

            <TokenIcon token={TOKENS.xvs} css={styles.successModalToken} />

            <Typography variant="small2" css={[styles.fontWeight600, styles.successMessage]}>
              {xvsAmountWei &&
                convertWeiToTokens({
                  valueWei: xvsAmountWei,
                  token: TOKENS.xvs,
                  returnInReadableFormat: true,
                })}
            </Typography>
          </div>
        ),
      });
    } catch (err) {
      toast.error({ message: (err as Error).message });
    }
  };

  const userVrtBalance =
    userVrtBalanceWei &&
    convertWeiToTokens({ valueWei: userVrtBalanceWei, token: TOKENS.vrt }).toFixed();

  return (
    <div css={styles.root}>
      <ConnectWallet message={t('convertVrt.connectWalletToConvertVrtToXvs')}>
        <EnableToken
          title={t('convertVrt.enableVrt')}
          token={TOKENS.vrt}
          spenderAddress={vrtConverterProxyContractAddress}
        >
          <section css={styles.title}>
            <Typography variant="h3">{readableXvsAvailable}</Typography>
            <Typography variant="small2">{t('convertVrt.xvsAVailable')}</Typography>
          </section>

          <AmountForm onSubmit={onSubmit} maxAmount={userVrtBalance} css={styles.form}>
            {({ values, setFieldValue }) => {
              const xvsValue = calculateXvsFromVrt(new BigNumber(values.amount))
                ?.dp(TOKENS.vrt.decimals)
                .toFixed();
              return (
                <>
                  <div css={styles.inputSection}>
                    <Typography variant="small2" css={[styles.inputLabel, styles.fontWeight600]}>
                      {t('convertVrt.convertVrt')}
                    </Typography>
                    <FormikTokenTextField
                      token={TOKENS.vrt}
                      name="amount"
                      css={styles.input}
                      description={
                        <Trans
                          i18nKey="convertVrt.balance"
                          components={{
                            White: <span css={styles.whiteLabel} />,
                          }}
                          values={{
                            amount: readableUserVrtBalance,
                          }}
                        />
                      }
                      rightMaxButton={
                        userVrtBalance
                          ? {
                              label: t('convertVrt.max'),
                              onClick: () => setFieldValue('amount', userVrtBalance),
                            }
                          : undefined
                      }
                      displayableErrorCodes={[ErrorCode.HIGHER_THAN_MAX]}
                      data-testid={TEST_IDS.vrtTokenTextField}
                    />
                  </div>
                  <div css={styles.inputSection}>
                    <Typography variant="small2" css={[styles.inputLabel, styles.fontWeight600]}>
                      {t('convertVrt.youWillReceive')}
                    </Typography>
                    <TokenTextField
                      token={TOKENS.xvs}
                      name="xvs"
                      css={styles.input}
                      description={t('convertVrt.vrtEqualsXvs', {
                        xvsToVrtConversionRatio: xvsToVrtConversionRatio?.toFixed(),
                      })}
                      disabled
                      value={xvsValue || ''}
                      onChange={noop}
                      data-testid={TEST_IDS.xvsTokenTextField}
                    />
                  </div>
                  <FormikSubmitButton
                    css={styles.submitButton}
                    fullWidth
                    loading={convertVrtLoading}
                    enabledLabel={t('convertVrt.convertVrtToXvs')}
                    disabled={
                      (vrtConversionEndTime && +vrtConversionEndTime < Date.now()) ||
                      convertVrtLoading
                    }
                  />
                  <Typography css={styles.remainingTime}>
                    <Trans
                      i18nKey="convertVrt.remainingTime"
                      components={{
                        Icon: <Icon name="countdown" css={styles.remainingTimeSvg} />,
                        White: <span css={styles.whiteLabel} />,
                      }}
                      values={{ date: vrtConversionEndTime }}
                    />
                  </Typography>
                </>
              );
            }}
          </AmountForm>
        </EnableToken>
      </ConnectWallet>
    </div>
  );
};

export default Convert;
