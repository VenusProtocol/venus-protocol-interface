/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import { Typography } from '@mui/material';
import {
  FormikTokenTextField,
  LabeledProgressBar,
  FormikSubmitButton,
  ConnectWallet,
  Icon,
} from 'components';
import { useTranslation } from 'translation';
import useConvertToReadableCoinString from 'hooks/useConvertToReadableCoinString';
import { format } from 'utilities/common';
import { ConvertVrtForm } from '../Form';
import { VRT_ID, XVS_ID } from '../constants';
import { useStyles } from '../styles';

interface ConvertProps {
  xvsTotal: BigNumber;
  xvsToVrtRate: BigNumber;
  vrtLimitUsed: number;
  vrtLimit: number;
  vestingTime: number;
}

const Convert: React.FC<ConvertProps> = ({
  xvsTotal,
  xvsToVrtRate,
  vrtLimitUsed,
  vrtLimit,
  vestingTime,
}) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();
  const readableXvsAvailable = useMemo(
    () =>
      useConvertToReadableCoinString({
        valueWei: xvsTotal,
        tokenId: XVS_ID,
      }),
    [xvsTotal],
  );
  return (
    <div css={styles.root}>
      <section css={styles.title}>
        <Typography variant="h3">{readableXvsAvailable}</Typography>
        <Typography variant="small2">{t('convertVrt.xvsAVailable')}</Typography>
      </section>
      <ConnectWallet message={t('convertVrt.connectWalletToConvertVrtToXvs')}>
        <ConvertVrtForm
          onSubmit={noop}
          maxVrt={new BigNumber(vrtLimit).toFixed()}
          maxXvs={new BigNumber(xvsTotal).toFixed()}
        >
          {() => (
            <>
              <div css={styles.inputSection}>
                <Typography variant="small2" css={styles.inputLabel}>
                  {t('convertVrt.convertVrt')}
                </Typography>
                <FormikTokenTextField
                  tokenId={VRT_ID}
                  name="vrt"
                  max={xvsTotal.toFixed()}
                  css={styles.input}
                  description={
                    <Trans
                      i18nKey="convertVrt.balance"
                      components={{
                        White: <span css={styles.whiteLabel} />,
                      }}
                      values={{ amount: format(new BigNumber(vrtLimit)) }}
                    />
                  }
                />
              </div>
              <div css={styles.inputSection}>
                <Typography variant="small2" css={styles.inputLabel}>
                  {t('convertVrt.youWillReceive')}
                </Typography>
                <FormikTokenTextField
                  tokenId={XVS_ID}
                  name="xvs"
                  css={styles.input}
                  description={t('convertVrt.vrtEqualsXvs', { xvsToVrtRate })}
                />
              </div>
              <div css={styles.progressBar}>
                <LabeledProgressBar
                  greyLeftText={t('convertVrt.dailyLimit')}
                  whiteRightText={t('convertVrt.usedOverTotalVrt', {
                    used: vrtLimitUsed,
                    total: vrtLimit,
                  })}
                  value={vrtLimitUsed / vrtLimit}
                  step={1}
                  min={0}
                  max={100}
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
                  i18nKey="convertVrt.remainingTime"
                  components={{
                    Icon: <Icon name="countdown" />,
                    White: <span css={styles.whiteLabel} />,
                  }}
                  values={{ time: vestingTime }}
                />
              </Typography>
            </>
          )}
        </ConvertVrtForm>
      </ConnectWallet>
    </div>
  );
};

export default Convert;
