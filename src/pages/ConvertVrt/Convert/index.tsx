/** @jsxImportSource @emotion/react */
import React, { useCallback, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import { Typography } from '@mui/material';
import {
  FormikTokenTextField,
  FormikSubmitButton,
  ConnectWallet,
  EnableToken,
  Icon,
  TokenTextField,
  toast,
} from 'components';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import { useTranslation } from 'translation';
import useConvertToReadableCoinString from 'hooks/useConvertToReadableCoinString';
import { AmountForm, ErrorCode } from 'containers/AmountForm';
import { formatI18nextRelativetimeValues } from 'utilities';
import { InternalError } from 'utilities/errors';
import { convertCoinsToWei, convertWeiToCoins, formatCoinsToReadableValue } from 'utilities/common';
import { VRT_ID, XVS_ID, VRT_DECIMAL } from '../constants';
import { useStyles } from '../styles';

export interface IConvertProps {
  xvsToVrtConversionRatio: BigNumber | undefined;
  vrtConversionEndTime: Date | undefined;
  userVrtBalanceWei: BigNumber | undefined;
  convertVrtLoading: boolean;
  convertVrt: (amount: string) => Promise<string>;
  walletConnected: boolean;
}

const Convert: React.FC<IConvertProps> = ({
  xvsToVrtConversionRatio,
  vrtConversionEndTime,
  userVrtBalanceWei,
  convertVrtLoading,
  convertVrt,
  walletConnected,
}) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();
  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

  const readableXvsAvailable = useConvertToReadableCoinString({
    valueWei: xvsToVrtConversionRatio && userVrtBalanceWei?.times(xvsToVrtConversionRatio),
    tokenId: XVS_ID,
  });

  const readableUserVrtBalance = useMemo(() => {
    const userVrtBalanceCoins =
      userVrtBalanceWei &&
      convertWeiToCoins({
        valueWei: userVrtBalanceWei,
        tokenId: VRT_ID,
      });

    return formatCoinsToReadableValue({
      value: userVrtBalanceCoins,
      tokenId: VRT_ID,
    });
  }, [userVrtBalanceWei?.toFixed()]);

  useConvertToReadableCoinString({
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

  const { relativeTimeTranslationKey, realtiveTimeFormatValues } =
    formatI18nextRelativetimeValues(vrtConversionEndTime);

  const onSubmit = async (vrtAmount: string) => {
    try {
      const vrtAmountWei = convertCoinsToWei({ value: new BigNumber(vrtAmount), tokenId: VRT_ID });
      const transactionHash = await convertVrt(vrtAmountWei.toFixed());
      // Display successful transaction modal
      if (!xvsToVrtConversionRatio) {
        // This should never happen because the form is not rendered without successfully fetching this
        throw new InternalError(t('convertVrt.internalErrorXvsToVrtConversionRatioUndefined'));
      }

      const xvsAmountWei = calculateXvsFromVrt(vrtAmountWei);

      openSuccessfulTransactionModal({
        title: t('convertVrt.successfulConvertTransactionModal.title'),
        transactionHash,
        content: (
          <div css={styles.successModalConversionAmounts}>
            <Icon name={VRT_ID} css={styles.successModalToken} />
            <Typography variant="small2" css={[styles.fontWeight600, styles.successMessage]}>
              {convertWeiToCoins({
                valueWei: vrtAmountWei,
                tokenId: VRT_ID,
                returnInReadableFormat: true,
              })}
            </Typography>
            <Icon name="arrowShaft" css={styles.successModalArrow} />
            <Icon name={XVS_ID} css={styles.successModalToken} />
            <Typography variant="small2" css={[styles.fontWeight600, styles.successMessage]}>
              {xvsAmountWei &&
                convertWeiToCoins({
                  valueWei: xvsAmountWei,
                  tokenId: XVS_ID,
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
    convertWeiToCoins({ valueWei: userVrtBalanceWei, tokenId: VRT_ID }).toFixed();

  return (
    <div css={styles.root}>
      {walletConnected ? (
        <section css={styles.title}>
          <Typography variant="h3">{readableXvsAvailable}</Typography>
          <Typography variant="small2">{t('convertVrt.xvsAVailable')}</Typography>
        </section>
      ) : (
        <div css={styles.smallSpacer} />
      )}
      <ConnectWallet message={t('convertVrt.connectWalletToConvertVrtToXvs')}>
        <EnableToken title={t('convertVrt.enableVrt')} vTokenId={VRT_ID}>
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
                      tokenId={VRT_ID}
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
                      data-testid="vrt-token-text-field"
                    />
                  </div>
                  <div css={styles.inputSection}>
                    <Typography variant="small2" css={[styles.inputLabel, styles.fontWeight600]}>
                      {t('convertVrt.youWillReceive')}
                    </Typography>
                    <TokenTextField
                      tokenId={XVS_ID}
                      name="xvs"
                      css={styles.input}
                      description={t('convertVrt.vrtEqualsXvs', {
                        xvsToVrtConversionRatio: xvsToVrtConversionRatio?.toFixed(),
                      })}
                      disabled
                      value={xvsValue || ''}
                      onChange={noop}
                      data-testid="xvs-token-text-field"
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
                      i18nKey={relativeTimeTranslationKey}
                      components={{
                        Icon: <Icon name="countdown" css={styles.remainingTimeSvg} />,
                        White: <span css={styles.whiteLabel} />,
                      }}
                      values={realtiveTimeFormatValues}
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
