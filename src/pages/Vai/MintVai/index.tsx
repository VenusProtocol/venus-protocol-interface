/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  ConnectWallet,
  EnableToken,
  FormikSubmitButton,
  LabeledInlineContent,
  Spinner,
} from 'components';
import { ContractReceipt } from 'ethers';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'translation';
import {
  convertTokensToWei,
  convertWeiToTokens,
  formatPercentage,
  getContractAddress,
} from 'utilities';

import {
  useGetBalanceOf,
  useGetMintableVai,
  useGetVaiRepayApy,
  useGetVaiTreasuryPercentage,
  useMintVai,
} from 'clients/api';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { TOKENS } from 'constants/tokens';
import { AmountForm, AmountFormProps } from 'containers/AmountForm';
import { useAuth } from 'context/AuthContext';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import FormikTokenTextFieldWithBalance from '../TextFieldWithBalance';
import { useStyles } from '../styles';
import getReadableFeeVai from './getReadableFeeVai';

const vaiControllerContractAddress = getContractAddress('vaiController');

export interface MintVaiUiProps {
  disabled: boolean;
  isInitialLoading: boolean;
  isSubmitting: boolean;
  mintVai: (value: BigNumber) => Promise<ContractReceipt | undefined>;
  userBalanceWei?: BigNumber;
  apyPercentage?: BigNumber;
  limitWei?: BigNumber;
  mintFeePercentage?: number;
}

export const MintVaiUi: React.FC<MintVaiUiProps> = ({
  disabled,
  limitWei,
  mintFeePercentage,
  isInitialLoading,
  userBalanceWei,
  apyPercentage,
  isSubmitting,
  mintVai,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const handleTransactionMutation = useHandleTransactionMutation();

  const limitTokens = useMemo(
    () =>
      limitWei ? convertWeiToTokens({ valueWei: limitWei, token: TOKENS.vai }).toFixed() : '0',
    [limitWei?.toFixed()],
  );

  // Convert limit into VAI
  const readableVaiLimit = useConvertWeiToReadableTokenString({
    valueWei: limitWei,
    token: TOKENS.vai,
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
      });
      return `${readableFeeVai} (${mintFeePercentage}%)`;
    },
    [mintFeePercentage],
  );

  const onSubmit: AmountFormProps['onSubmit'] = amountTokens => {
    const amountWei = convertTokensToWei({
      value: new BigNumber(amountTokens),
      token: TOKENS.vai,
    });

    return handleTransactionMutation({
      mutate: () => mintVai(amountWei),
      successTransactionModalProps: contractReceipt => ({
        title: t('vai.mintVai.successfulTransactionModal.title'),
        content: t('vai.mintVai.successfulTransactionModal.message'),
        amount: {
          valueWei: amountWei,
          token: TOKENS.vai,
        },
        transactionHash: contractReceipt.transactionHash,
      }),
    });
  };

  return (
    <ConnectWallet message={t('vai.mintVai.connectWallet')}>
      <EnableToken
        title={t('vai.mintVai.enableToken')}
        token={TOKENS.vai}
        spenderAddress={vaiControllerContractAddress}
      >
        {isInitialLoading ? (
          <Spinner />
        ) : (
          <AmountForm onSubmit={onSubmit} css={styles.tabContentContainer} maxAmount={limitTokens}>
            {({ values }) => (
              <>
                <div css={styles.ctaContainer}>
                  <FormikTokenTextFieldWithBalance
                    disabled={disabled || isSubmitting || !hasMintableVai}
                    maxValue={limitTokens}
                    userBalanceWei={userBalanceWei}
                    maxButtonLabel={t('vai.mintVai.rightMaxButtonLabel')}
                  />

                  <LabeledInlineContent
                    css={styles.getRow({ isLast: false })}
                    iconSrc={TOKENS.vai}
                    label={t('vai.mintVai.vaiLimitLabel')}
                  >
                    {readableVaiLimit}
                  </LabeledInlineContent>

                  <LabeledInlineContent
                    css={styles.getRow({ isLast: false })}
                    iconSrc="fee"
                    label={t('vai.mintVai.apy')}
                  >
                    {apyPercentage ? `${formatPercentage(apyPercentage)}%` : PLACEHOLDER_KEY}
                  </LabeledInlineContent>

                  <LabeledInlineContent
                    css={styles.getRow({ isLast: true })}
                    iconSrc="fee"
                    label={t('vai.mintVai.mintFeeLabel')}
                  >
                    {getReadableMintFee(values.amount)}
                  </LabeledInlineContent>
                </div>

                <FormikSubmitButton
                  loading={isSubmitting}
                  disabled={disabled}
                  fullWidth
                  enabledLabel={t('vai.mintVai.submitButtonLabel')}
                  disabledLabel={t('vai.mintVai.submitButtonDisabledLabel')}
                />
              </>
            )}
          </AmountForm>
        )}
      </EnableToken>
    </ConnectWallet>
  );
};

const MintVai: React.FC = () => {
  const { accountAddress } = useAuth();

  const { data: mintableVaiData, isLoading: isGetMintableVaiLoading } = useGetMintableVai(
    {
      accountAddress,
    },
    {
      enabled: !!accountAddress,
    },
  );

  const { data: userVaiBalanceData, isLoading: isGetUserVaiBalance } = useGetBalanceOf(
    {
      accountAddress: accountAddress || '',
      token: TOKENS.vai,
    },
    {
      enabled: !!accountAddress,
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
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
    />
  );
};

export default MintVai;
