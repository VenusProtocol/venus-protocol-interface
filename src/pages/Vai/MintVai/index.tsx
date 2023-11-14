/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  Delimiter,
  FormikSubmitButton,
  FormikTokenTextField,
  LabeledInlineContent,
  Spinner,
} from 'components';
import { VError, displayMutationError } from 'errors';
import { useGetToken } from 'packages/tokens';
import { useTranslation } from 'packages/translations';
import React, { useCallback, useMemo } from 'react';
import { Token } from 'types';
import {
  convertTokensToWei,
  convertWeiToTokens,
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
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';

import { useStyles } from '../styles';
import getReadableFeeVai from './getReadableFeeVai';

export interface MintVaiUiProps {
  disabled: boolean;
  isInitialLoading: boolean;
  isSubmitting: boolean;
  mintVai: (value: BigNumber) => Promise<unknown>;
  userBalanceWei?: BigNumber;
  apyPercentage?: BigNumber;
  limitWei?: BigNumber;
  mintFeePercentage?: number;
  vai: Token;
}

const userVaiRefetchInterval = generatePseudoRandomRefetchInterval();

export const MintVaiUi: React.FC<MintVaiUiProps> = ({
  disabled,
  limitWei,
  mintFeePercentage,
  isInitialLoading,
  userBalanceWei,
  apyPercentage,
  isSubmitting,
  vai,
  mintVai,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const limitTokens = useMemo(
    () => (limitWei ? convertWeiToTokens({ valueWei: limitWei, token: vai }).toFixed() : '0'),
    [limitWei, vai],
  );

  // Convert limit into VAI
  const readableVaiLimit = useConvertWeiToReadableTokenString({
    valueWei: limitWei,
    token: vai,
  });

  const readableWalletBalance = useConvertWeiToReadableTokenString({
    valueWei: userBalanceWei,
    token: vai,
  });

  const hasMintableVai = limitWei?.isGreaterThan(0) || false;

  const getReadableMintFee = useCallback(
    (valueWei: string) => {
      if (!mintFeePercentage) {
        return PLACEHOLDER_KEY;
      }

      const readableFeeVai = getReadableFeeVai({
        valueWei: new BigNumber(valueWei || 0),
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

    const amountWei = convertTokensToWei({
      value: new BigNumber(amountTokens),
      token: vai,
    });

    try {
      await mintVai(amountWei);
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

  const mintVai: MintVaiUiProps['mintVai'] = async amountWei =>
    contractMintVai({
      amountWei,
    });

  return (
    <MintVaiUi
      disabled={!accountAddress || isGetVaiTreasuryPercentageLoading || isGetUserVaiBalance}
      limitWei={mintableVaiData?.mintableVaiWei}
      userBalanceWei={userVaiBalanceData?.balanceWei}
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
