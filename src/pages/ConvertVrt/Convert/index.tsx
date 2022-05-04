/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import { Typography } from '@mui/material';
import {
  FormikTokenTextField,
  LabeledProgressBar,
  FormikSubmitButton,
  ConnectWallet,
  Icon,
  TokenTextField,
} from 'components';
import { useTranslation } from 'translation';
import useConvertToReadableCoinString from 'hooks/useConvertToReadableCoinString';
import { format } from 'utilities/common';
import { formatI18nextRelativetimeValues } from 'utilities';
import { AmountForm, ErrorCode } from 'containers/AmountForm';
import { VRT_ID, XVS_ID, VRT_DECIMAL } from '../constants';
import { useStyles } from '../styles';

interface ConvertProps {
  xvsTotalWei: BigNumber;
  xvsToVrtRate: BigNumber;
  vrtLimitUsedWei: BigNumber;
  vrtLimitWei: BigNumber;
  vrtConversionEndTime: string | undefined;
  walletConnected: boolean;
}

const Convert: React.FC<ConvertProps> = ({
  xvsTotalWei,
  xvsToVrtRate,
  vrtLimitUsedWei,
  vrtLimitWei,
  vrtConversionEndTime,
  walletConnected,
}) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();
  const readableXvsAvailable = useConvertToReadableCoinString({
    valueWei: xvsTotalWei,
    tokenId: XVS_ID,
  });
  const { relativeTimeTranslationKey, realtiveTimeFormatValues } =
    formatI18nextRelativetimeValues(vrtConversionEndTime);

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
        <AmountForm onSubmit={noop} maxAmount={vrtLimitWei.toFixed()} css={styles.form}>
          {({ values }) => {
            const xvsValue = values.amount
              ? new BigNumber(values.amount).times(xvsToVrtRate).dp(VRT_DECIMAL).toFixed()
              : '';
            return (
              <>
                <div css={styles.inputSection}>
                  <Typography variant="small2" css={styles.inputLabel}>
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
                        values={{ amount: format(new BigNumber(vrtLimitWei)) }}
                      />
                    }
                    rightMaxButton={{
                      label: t('convertVrt.max').toUpperCase(),
                      valueOnClick: xvsTotalWei.toFixed(),
                    }}
                    displayableErrorCodes={[ErrorCode.HIGHER_THAN_MAX]}
                  />
                </div>
                <div css={styles.inputSection}>
                  <Typography variant="small2" css={styles.inputLabel}>
                    {t('convertVrt.youWillReceive')}
                  </Typography>
                  <TokenTextField
                    tokenId={XVS_ID}
                    name="xvs"
                    css={styles.input}
                    description={t('convertVrt.vrtEqualsXvs', { xvsToVrtRate })}
                    disabled
                    value={xvsValue}
                    onChange={noop}
                  />
                </div>
                <div css={styles.progressBar}>
                  <LabeledProgressBar
                    greyLeftText={t('convertVrt.dailyLimit')}
                    whiteRightText={t('convertVrt.usedOverTotalVrt', {
                      used: vrtLimitUsedWei,
                      total: vrtLimitWei,
                    })}
                    value={vrtLimitUsedWei.dividedBy(vrtLimitWei).times(100).toNumber()}
                    step={1}
                    min={0}
                    max={100}
                    mark={undefined}
                    ariaLabel={t('convertVrt.progressBar')}
                  />
                </div>
                <FormikSubmitButton
                  css={styles.submitButton}
                  fullWidth
                  loading={false}
                  enabledLabel={t('convertVrt.convertVrttoXvs')}
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
      </ConnectWallet>
    </div>
  );
};

export default Convert;
