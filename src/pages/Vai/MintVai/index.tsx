/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  Delimiter,
  FormikSubmitButton,
  FormikTokenTextField,
  LabeledInlineContent,
  Spinner,
} from 'components';
import { VError, displayMutationError } from 'packages/errors';
import { useGetToken } from 'packages/tokens';
import { useTranslation } from 'packages/translations';
import React, { useCallback, useMemo } from 'react';
import { Token } from 'types';
import {
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatPercentageToReadableValue,
  generatePseudoRandomRefetchInterval,
} from 'utilities';

import {
  useGetBalanceOf,
  useGetMintableVai,
  useGetVaiRepayApy,
  useGetVaiTreasuryPercentage,
  useMintVai,
} from 'clients/api';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { AmountForm } from 'containers/AmountForm';
import { ConnectWallet } from 'containers/ConnectWallet';
import { useAuth } from 'context/AuthContext';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';

import { useStyles } from '../styles';
import getReadableFeeVai from './getReadableFeeVai';

export interface MintVaiUiProps {
  disabled: boolean;
  isInitialLoading: boolean;
  isSubmitting: boolean;
  mintVai: (value: BigNumber) => Promise<unknown>;
  userBalanceMantissa?: BigNumber;
  apyPercentage?: BigNumber;
  limitMantissa?: BigNumber;
  mintFeePercentage?: number;
  vai: Token;
}

const userVaiRefetchInterval = generatePseudoRandomRefetchInterval();

export const MintVaiUi: React.FC<MintVaiUiProps> = ({
  disabled,
  limitMantissa,
  mintFeePercentage,
  isInitialLoading,
  userBalanceMantissa,
  apyPercentage,
  isSubmitting,
  vai,
  mintVai,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const limitTokens = useMemo(
    () =>
      limitMantissa ? convertMantissaToTokens({ value: limitMantissa, token: vai }).toFixed() : '0',
    [limitMantissa, vai],
  );

  // Convert limit into VAI
  const readableVaiLimit = useConvertMantissaToReadableTokenString({
    value: limitMantissa,
    token: vai,
  });

  const readableWalletBalance = useConvertMantissaToReadableTokenString({
    value: userBalanceMantissa,
    token: vai,
  });

  const hasMintableVai = limitMantissa?.isGreaterThan(0) || false;

  const getReadableMintFee = useCallback(
    (value: string) => {
      if (!mintFeePercentage) {
        return PLACEHOLDER_KEY;
      }

      const readableFeeVai = getReadableFeeVai({
        value: new BigNumber(value || 0),
        mintFeePercentage,
        vai,
      });
      return `${readableFeeVai} (${mintFeePercentage}%)`;
    },
    [mintFeePercentage, vai],
  );

  const onSubmit = async (amountTokens: string) => {
    if (!vai) {
      throw new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      });
    }

    const amountMantissa = convertTokensToMantissa({
      value: new BigNumber(amountTokens),
      token: vai,
    });

    try {
      await mintVai(amountMantissa);
    } catch (error) {
      displayMutationError({ error });
    }
  };

  return (
    <ConnectWallet message={t('vai.mintVai.connectWallet')}>
      {isInitialLoading ? (
        <Spinner />
      ) : (
        <AmountForm onSubmit={onSubmit} maxAmount={limitTokens}>
          {({ values, setValues }) => (
            <>
              <FormikTokenTextField
                name="amount"
                css={styles.getRow({ isLast: true })}
                token={vai}
                max={limitTokens}
                disabled={disabled || isSubmitting || !hasMintableVai}
                rightMaxButton={{
                  label: t('vai.mintVai.rightMaxButtonLabel'),
                  onClick: () =>
                    setValues(currentValues => ({ ...currentValues, amount: limitTokens })),
                }}
              />

              <div css={styles.getRow({ isLast: true })}>
                <LabeledInlineContent
                  css={styles.getRow({ isLast: false })}
                  label={t('vai.repayVai.walletBalance')}
                >
                  {readableWalletBalance}
                </LabeledInlineContent>
              </div>

              <Delimiter css={styles.getRow({ isLast: true })} />

              <LabeledInlineContent
                css={styles.getRow({ isLast: false })}
                iconSrc={vai}
                label={t('vai.mintVai.vaiLimitLabel')}
              >
                {readableVaiLimit}
              </LabeledInlineContent>

              <LabeledInlineContent
                css={styles.getRow({ isLast: false })}
                iconSrc="fee"
                label={t('vai.mintVai.apy')}
              >
                {formatPercentageToReadableValue(apyPercentage)}
              </LabeledInlineContent>

              <LabeledInlineContent
                css={styles.getRow({ isLast: true })}
                iconSrc="fee"
                label={t('vai.mintVai.mintFeeLabel')}
              >
                {getReadableMintFee(values.amount)}
              </LabeledInlineContent>

              <FormikSubmitButton
                loading={isSubmitting}
                disabled={disabled}
                className="w-full"
                enabledLabel={t('vai.mintVai.submitButtonLabel')}
                disabledLabel={t('vai.mintVai.submitButtonDisabledLabel')}
              />
            </>
          )}
        </AmountForm>
      )}
    </ConnectWallet>
  );
};

const MintVai: React.FC = () => {
  const { accountAddress } = useAuth();
  const vai = useGetToken({
    symbol: 'VAI',
  });

  const { data: mintableVaiData, isLoading: isGetMintableVaiLoading } = useGetMintableVai(
    {
      accountAddress: accountAddress || '',
    },
    {
      enabled: !!accountAddress,
    },
  );

  const { data: userVaiBalanceData, isLoading: isGetUserVaiBalance } = useGetBalanceOf(
    {
      accountAddress: accountAddress || '',
      token: vai!,
    },
    {
      enabled: !!accountAddress,
      refetchInterval: userVaiRefetchInterval,
    },
  );

  const { data: getVaiRepayApyData } = useGetVaiRepayApy();

  const { data: vaiTreasuryData, isLoading: isGetVaiTreasuryPercentageLoading } =
    useGetVaiTreasuryPercentage();

  const { mutateAsync: contractMintVai, isLoading: isSubmitting } = useMintVai();

  const mintVai: MintVaiUiProps['mintVai'] = async amountMantissa =>
    contractMintVai({
      amountMantissa,
    });

  return (
    <MintVaiUi
      disabled={!accountAddress || isGetVaiTreasuryPercentageLoading || isGetUserVaiBalance}
      limitMantissa={mintableVaiData?.mintableVaiMantissa}
      userBalanceMantissa={userVaiBalanceData?.balanceMantissa}
      mintFeePercentage={vaiTreasuryData?.percentage}
      isInitialLoading={isGetMintableVaiLoading}
      isSubmitting={isSubmitting}
      apyPercentage={getVaiRepayApyData?.repayApyPercentage}
      mintVai={mintVai}
      vai={vai!}
    />
  );
};

export default MintVai;
