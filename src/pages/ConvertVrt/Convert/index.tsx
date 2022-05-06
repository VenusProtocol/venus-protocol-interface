/** @jsxImportSource @emotion/react */
import React, { useCallback } from 'react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import { Typography } from '@mui/material';
import {
  FormikTokenTextField,
  FormikSubmitButton,
  ConnectWallet,
  EnableToken,
  Icon,
  Token,
  TokenTextField,
} from 'components';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import toast from 'components/Basic/Toast';
import { useTranslation } from 'translation';
import useConvertToReadableCoinString from 'hooks/useConvertToReadableCoinString';
import { formatI18nextRelativetimeValues } from 'utilities';
import { AmountForm, ErrorCode } from 'containers/AmountForm';
import { convertWeiToCoins } from 'utilities/common';
import { getContractAddress } from 'utilities';
import { VRT_ID, XVS_ID, VRT_DECIMAL } from '../constants';
import { useStyles } from '../styles';

export interface IConvertProps {
  xvsToVrtConversionRatio: BigNumber | undefined;
  vrtConversionEndTime: Date | undefined;
  userVrtBalanceWei: BigNumber | undefined;
  vrtConversionLoading: boolean;
  userVrtEnabled: boolean;
  convertVrt: (amount: string) => Promise<string>;
  walletConnected: boolean;
}

const Convert: React.FC<IConvertProps> = ({
  xvsToVrtConversionRatio,
  vrtConversionEndTime,
  userVrtBalanceWei,
  vrtConversionLoading,
  userVrtEnabled,
  convertVrt,
  walletConnected,
}) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();
  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();
  const vrtConverterProxyAddress = getContractAddress('vrtConverterProxy');

  const readableXvsAvailable = useConvertToReadableCoinString({
    valueWei: userVrtBalanceWei?.times(xvsToVrtConversionRatio || 1),
    tokenId: XVS_ID,
  });
  const readableUserVrtBalance = useConvertToReadableCoinString({
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
      });
    } catch (err) {
      toast.error({ title: (err as Error).message });
    }
  };

  return (
    <div css={styles.root}>
      {walletConnected ? (
        <section css={styles.title}>
          <Typography variant="h3">{readableXvsAvailable || PLACEHOLDER_KEY}</Typography>
          <Typography variant="small2">{t('convertVrt.xvsAVailable')}</Typography>
        </section>
      ) : (
        <div css={styles.smallSpacer} />
      )}
      <ConnectWallet message={t('convertVrt.connectWalletToConvertVrtToXvs')}>
        <EnableToken
          title={t('convertVrt.enableVrt')}
          assetId={VRT_ID}
          isEnabled={userVrtEnabled}
          tokenInfo={[
            {
              iconName: 'xvs',
              label: 'VRT Conversion Ratio',
              children: xvsToVrtConversionRatio?.toFixed(6),
            },
            { iconName: 'vrt', label: 'Current VRT Balance', children: readableUserVrtBalance },
          ]}
          vtokenAddress={vrtConverterProxyAddress}
        >
          <AmountForm
            onSubmit={onSubmit}
            maxAmount={userVrtBalanceWei?.toFixed()}
            css={styles.form}
          >
            {({ values }) => {
              const xvsValue = values.amount
              ? new BigNumber(values.amount).times(xvsToVrtConversionRatio).dp(VRT_DECIMAL).toFixed()
              : '';
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
                          values={{ amount: readableUserVrtBalance }}
                        />
                      }
                      rightMaxButton={{
                        label: t('convertVrt.max').toUpperCase(),
                        valueOnClick: userVrtBalanceWei?.toFixed() || '',
                      }}
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
                      value={xvsValue}
                      onChange={noop}
                      data-testid="xvs-token-text-field"
                    />
                  </div>
                  <FormikSubmitButton
                    css={styles.submitButton}
                    fullWidth
                    loading={vrtConversionLoading}
                    enabledLabel={t('convertVrt.convertVrtToXvs')}
                    disabled={
                      (vrtConversionEndTime && +vrtConversionEndTime < Date.now()) ||
                      vrtConversionLoading
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
