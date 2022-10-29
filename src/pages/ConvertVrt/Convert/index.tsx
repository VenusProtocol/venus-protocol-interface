/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import {
  ConnectWallet,
  EnableToken,
  FormikSubmitButton,
  FormikTokenTextField,
  Icon,
  TokenTextField,
  toast,
} from 'components';
import noop from 'noop-ts';
import React, { useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';
import {
  convertTokensToWei,
  convertWeiToTokens,
  formatTokensToReadableValue,
  getContractAddress,
} from 'utilities';
import type { TransactionReceipt } from 'web3-core/types';

import { TOKENS } from 'constants/tokens';
import { XVS_TOKEN_ID } from 'constants/xvs';
import { AmountForm, ErrorCode } from 'containers/AmountForm';
import { DisableLunaUstWarningContext } from 'context/DisableLunaUstWarning';
import { VError } from 'errors/VError';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';

import { VRT_DECIMAL, VRT_ID } from '../constants';
import { useStyles } from '../styles';
import TEST_IDS from './testIds';

export interface ConvertProps {
  xvsToVrtConversionRatio: BigNumber | undefined;
  vrtConversionEndTime: Date | undefined;
  userVrtBalanceWei: BigNumber | undefined;
  convertVrtLoading: boolean;
  convertVrt: (amount: string) => Promise<TransactionReceipt>;
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
    tokenId: XVS_TOKEN_ID,
  });

  const readableUserVrtBalance = useMemo(() => {
    const userVrtBalanceTokens =
      userVrtBalanceWei &&
      convertWeiToTokens({
        valueWei: userVrtBalanceWei,
        tokenId: VRT_ID,
      });

    return formatTokensToReadableValue({
      value: userVrtBalanceTokens,
      tokenId: VRT_ID,
    });
  }, [userVrtBalanceWei?.toFixed()]);

  useConvertWeiToReadableTokenString({
    valueWei: userVrtBalanceWei,
    tokenId: VRT_ID,
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
      const vrtAmountWei = convertTokensToWei({ value: new BigNumber(vrtAmount), tokenId: VRT_ID });
      const transactionReceipt = await convertVrt(vrtAmountWei.toFixed());
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
        transactionHash: transactionReceipt.transactionHash,
        content: (
          <div css={styles.successModalConversionAmounts}>
            <Icon name={VRT_ID} css={styles.successModalToken} />
            <Typography variant="small2" css={[styles.fontWeight600, styles.successMessage]}>
              {convertWeiToTokens({
                valueWei: vrtAmountWei,
                tokenId: VRT_ID,
                returnInReadableFormat: true,
              })}
            </Typography>
            <Icon name="arrowShaft" css={styles.successModalArrow} />
            <Icon name={XVS_TOKEN_ID} css={styles.successModalToken} />
            <Typography variant="small2" css={[styles.fontWeight600, styles.successMessage]}>
              {xvsAmountWei &&
                convertWeiToTokens({
                  valueWei: xvsAmountWei,
                  tokenId: XVS_TOKEN_ID,
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
    convertWeiToTokens({ valueWei: userVrtBalanceWei, tokenId: VRT_ID }).toFixed();

  return (
    <div css={styles.root}>
      <ConnectWallet message={t('convertVrt.connectWalletToConvertVrtToXvs')}>
        <EnableToken
          title={t('convertVrt.enableVrt')}
          vTokenId={VRT_ID}
          spenderAddress={vrtConverterProxyContractAddress}
        >
          <section css={styles.title}>
            <Typography variant="h3">{readableXvsAvailable}</Typography>
            <Typography variant="small2">{t('convertVrt.xvsAVailable')}</Typography>
          </section>

          <AmountForm onSubmit={onSubmit} maxAmount={userVrtBalance} css={styles.form}>
            {({ values }) => {
              const xvsValue = calculateXvsFromVrt(new BigNumber(values.amount))
                ?.dp(VRT_DECIMAL)
                .toFixed();
              return (
                <>
                  <div css={styles.inputSection}>
                    <Typography variant="small2" css={[styles.inputLabel, styles.fontWeight600]}>
                      {t('convertVrt.convertVrt')}
                    </Typography>
                    <FormikTokenTextField
                      token={TOKENS.vrt as Token}
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
                              valueOnClick: userVrtBalance,
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
                      token={TOKENS.xvs as Token}
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
